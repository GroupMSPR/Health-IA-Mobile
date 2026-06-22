import { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('auth_token').then((token) => {
      if (!token) router.replace('/(auth)/login');
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}