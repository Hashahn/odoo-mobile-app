/**
 * api.config.js
 * API-specific configuration for Odoo mobile application
 */

const APIConfig = {
 // Base URLs
 baseURL: 'https://ilimasu.ru.tuna.am', // Production server
  // baseURL: 'https://test.odoo.server', // Test server
  // baseURL: 'http://localhost:8069', // Local development
  
  // API endpoints
  endpoints: {
    authenticate: '/web/session/authenticate',
    logout: '/web/session/logout',
    common: '/xmlrpc/2/common',
    object: '/xmlrpc/2/object',
    report: '/xmlrpc/2/report',
 },
  
  // Timeout settings (in milliseconds)
  timeout: 30000, // 30 seconds
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  
  // API version
  version: '17.0',
  
  // Retry settings
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // Pagination settings
  defaultPageSize: 80,
};

export default APIConfig;