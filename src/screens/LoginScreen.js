/**
 * LoginScreen.js
 * Login screen for the Odoo Mobile Application
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import OdooAPI from '../utils/OdooAPI';

const LoginScreen = ({ navigation }) => {
 const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 const [database, setDatabase] = useState('odoo_db'); // Default database name
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password || !database) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await OdooAPI.login(username, password, database);
      if (result.success) {
        // Navigate to main app after successful login
        navigation.replace('MainApp');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials or server error');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    // This is a placeholder for testing the connection to the Odoo server
    try {
      // We can't directly test the connection without credentials,
      // but we could make a request to check if the server is accessible
      Alert.alert('Connection Test', 'Connection test functionality will be implemented');
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot connect to the server');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Odoo Mobile</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Database Name"
          value={database}
          onChangeText={setDatabase}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.connectionButton} onPress={handleTestConnection}>
          <Text style={styles.connectionButtonText}>Test Connection</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectionButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  connectionButtonText: {
    color: '#1a73e8',
    fontSize: 16,
  },
});

export default LoginScreen;