import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/components/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
 );
};

export default App;