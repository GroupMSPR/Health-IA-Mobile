import { render, screen } from '@testing-library/react-native';
import Index from '../app/index';
import { useAuth } from '../context/authContext';

jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => {
  const { Text } = require('react-native');
  return {
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
    Slot: () => <Text testID="slot">slot</Text>,
    useRouter: () => ({}),
  };
});

const mockUseAuth = useAuth as jest.Mock;

describe('Index (redirect based on token)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirect to home when there is a token', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    await render(<Index />);

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(tabs)/home');
  });

  it("redirect to auth when there isn't a token ", async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    await render(<Index />);

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(auth)/login');
  });
});