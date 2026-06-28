import { useEffect, useState } from 'react';
import { Redirect, Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, Text } from 'react-native';

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
    return <Redirect href="/(auth)/login"/>;
  }

  return <Redirect href="/(tabs)/home"/>
}
