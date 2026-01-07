/**
 * AppNavigator.js
 * Main navigation structure for the Odoo Mobile Application
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { useAuth } from '../components/AuthProvider';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Navigator (after authentication)
const MainAppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Records') {
            iconName = 'list';
          } else if (route.name === 'CRM') {
            iconName = 'person';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="Records" 
        component={() => <></>} // Placeholder for Records screen
        options={{ title: 'Records' }} 
      />
      <Tab.Screen 
        name="CRM" 
        component={() => <></>} // Placeholder for CRM screen
        options={{ title: 'CRM' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={() => <></>} // Placeholder for Settings screen
        options={{ title: 'Settings' }} 
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'MainApp' : 'Login'}>
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        ) : (
          <Stack.Screen 
            name="MainApp" 
            component={MainAppNavigator} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;