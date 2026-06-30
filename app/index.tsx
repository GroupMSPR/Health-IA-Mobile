import { useEffect, useState } from 'react';
import { Redirect, Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, Text } from 'react-native';
import { useAuth } from '../context/authContext';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated){
    return <Redirect href="/(auth)/login"/>;
  }

  return <Redirect href="/(tabs)/home"/>
}
