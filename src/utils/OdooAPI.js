/**
 * OdooAPI.js
 * Main API client for Odoo 17.0 communication
 */

import axios from 'axios';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import APIConfig from '../config/api.config';

class OdooAPI {
  constructor() {
    this.baseURL = APIConfig.baseURL;
    this.sessionId = null;
    this.uid = null;
    this.db = null;
    this.timeout = APIConfig.timeout || 30000;
  }

  // Initialize API with configuration
  async initialize(config) {
    this.baseURL = config?.baseURL || APIConfig.baseURL;
    this.db = config?.db || this.db;
    this.timeout = config?.timeout || APIConfig.timeout || 30000;
    
    // Check for existing session
    await this.checkStoredSession();
  }

  // Check if we have stored session data
  async checkStoredSession() {
    try {
      const sessionData = await AsyncStorage.getItem('odoo_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        this.sessionId = parsed.sessionId;
        this.uid = parsed.uid;
        this.db = parsed.db;
      }
    } catch (error) {
      console.warn('No stored session found');
    }
  }

  // Store session data
  async storeSession() {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        uid: this.uid,
        db: this.db
      };
      await AsyncStorage.setItem('odoo_session', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  // Clear stored session
  async clearSession() {
    try {
      await AsyncStorage.removeItem('odoo_session');
      this.sessionId = null;
      this.uid = null;
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

 // Login to Odoo
  async login(username, password, db) {
    const loginData = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        db: db || this.db,
        login: username,
        password: password
      },
      id: Math.floor(Math.random() * 1000)
    };

    try {
      const response = await axios.post(
        `${this.baseURL}${APIConfig.endpoints.authenticate}`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: this.timeout
        }
      );

      if (response.data.result && response.data.result.uid) {
        this.sessionId = response.data.result.session_id;
        this.uid = response.data.result.uid;
        this.db = response.data.result.db;
        await this.storeSession();
        return { success: true, uid: this.uid, db: this.db };
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout from Odoo
  async logout() {
    try {
      // Call Odoo logout endpoint
      await axios.post(
        `${this.baseURL}${APIConfig.endpoints.logout}`,
        {},
        {
          headers: {
            'X-Openerp-Session-Id': this.sessionId,
          },
          timeout: this.timeout
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearSession();
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.sessionId !== null && this.uid !== null;
  }

  // Make an authenticated request to Odoo
  async makeRequest(model, method, args, kwargs = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const requestData = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: method,
        args: [this.db, this.uid, this.sessionId, model, ...args],
        kwargs: kwargs
      },
      id: Math.floor(Math.random() * 1000)
    };

    try {
      const response = await axios.post(
        `${this.baseURL}${APIConfig.endpoints.object}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...APIConfig.defaultHeaders
          },
          timeout: this.timeout
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error.message || 'API request failed');
      }

      return response.data.result;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Get data from a model
  async searchRead(model, domain = [], fields = [], offset = 0, limit = 80, order = '') {
    return this.makeRequest(model, 'search_read', [domain, fields, offset, limit, order]);
  }

  // Get record count
  async searchCount(model, domain = []) {
    return this.makeRequest(model, 'search_count', [domain]);
  }

  // Create a new record
  async create(model, data) {
    return this.makeRequest(model, 'create', [data]);
  }

  // Update a record
  async write(model, id, data) {
    return this.makeRequest(model, 'write', [[id], data]);
  }

  // Delete a record
  async unlink(model, id) {
    return this.makeRequest(model, 'unlink', [[id]]);
  }

  // Call a custom method
  async execute(model, method, args = [], kwargs = {}) {
    return this.makeRequest(model, method, args, kwargs);
  }
}

export default new OdooAPI();