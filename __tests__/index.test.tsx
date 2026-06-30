// Index.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Index from '../app/index';
import { useAuth } from '../context/authContext';

// Mock du hook d'authentification (présence du token = isAuthenticated)
jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

// Mock d'expo-router pour inspecter la cible du Redirect
jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
    Slot: () => <Text testID="slot">slot</Text>,
    useRouter: () => ({}),
  };
});

const mockUseAuth = useAuth as jest.Mock;

describe('Index (redirection selon le token)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirige vers home quand le token est présent', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    await render(<Index />);

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(tabs)/home');
  });

  it("redirige vers auth/login quand il n'y a pas de token", async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    await render(<Index />);

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(auth)/login');
  });
});