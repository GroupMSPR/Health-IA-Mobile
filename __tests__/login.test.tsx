import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/(auth)/login';
import api from '../lib/api';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/authContext';

jest.mock('../lib/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  router: { replace: jest.fn() },
}));

jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

const mockPost = api.post as jest.Mock;
const mockLogin = jest.fn();

describe('LoginScreen (route et logique de connexion)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  const fillAndSubmit = async () => {
    const user = userEvent.setup();
    await render(<LoginScreen />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'secret123');
    await user.press(screen.getByText('Login'));
  };

  it('appelle /api/login, stocke le token et redirige vers home en cas de succès', async () => {
    mockPost.mockResolvedValueOnce({
      status: 200,
      data: { user: { id: 'u1', email: 'john@example.com' }, access_token: 'token-123' },
    });

    await fillAndSubmit();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/login', {
        email: 'john@example.com',
        password: 'secret123',
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({ id: 'u1', email: 'john@example.com' });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'token-123');
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/home');
  });

  it('affiche une erreur et ne redirige pas en cas d\'identifiants incorrects (401)', async () => {
    mockPost.mockRejectedValueOnce({ response: { status: 401 } });

    await fillAndSubmit();

    expect(await screen.findByText('Identifiants incorrects. Veuillez réessayer.')).toBeTruthy();
    expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
