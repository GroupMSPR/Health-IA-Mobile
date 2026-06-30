// RootLayout.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RootLayout from '../app/_layout'; 
import { useAuth } from '../context/authContext';

// Mock the auth hook
jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

// Mock expo-router so we can inspect what Redirect/Slot receive
jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
    Slot: () => <Text testID="slot">slot</Text>,
    useRouter: () => ({}),
  };
});

const mockUseAuth = useAuth as jest.Mock;

describe('RootLayout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state while auth is resolving', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    render(<RootLayout />);

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('redirects to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(<RootLayout />);

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(auth)/login');
  });

  it('redirects to home when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(<RootLayout />);

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(tabs)/home');
  });
});