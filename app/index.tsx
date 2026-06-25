import { useEffect, useState } from 'react';
import { Redirect, Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    SecureStore.getItemAsync('auth_token').then(setToken);
  }, []);

  if (token === undefined) {
    return (
      <View>
        <Text>loading ...</Text>
      </View>
    );
  }

  if (!token){
    return <Redirect href="/(tabs)/home"/>;
  }

  return <Redirect href="/(tabs)/home"/>
}
