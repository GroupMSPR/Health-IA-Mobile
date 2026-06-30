import { render, waitFor, act } from '@testing-library/react-native';
import Home from '../app/(tabs)/home';
import api from '../lib/api';
import { useAuth } from '../context/authContext';

jest.mock('../lib/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

// On neutralise les composants visuels pour se concentrer sur la logique / les routes
jest.mock('../assets/componants/header', () => ({ FullHeader: () => null }));
jest.mock('../assets/componants/dashboardInfoSquare', () => () => null);
jest.mock('../assets/componants/exerciceVignet', () => () => null);
jest.mock('react-native-gifted-charts', () => ({ LineChart: () => null }));

const mockPost = api.post as jest.Mock;

describe('Home (routes API et logique de recommandation)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', first_name: 'John', weight: 70, height: 175 },
    });

    mockPost.mockImplementation((url: string) => {
      switch (url) {
        case '/api/users/search':
          return Promise.resolve({ data: { data: [{ id: 'u1' }] } });
        case '/api/ai/recommend':
          return Promise.resolve({
            data: { predictions: [{ exercise: 'Push Up', confidence: 0.9 }] },
          });
        case '/api/exercises/search':
          return Promise.resolve({
            data: {
              data: [
                {
                  id: 'e1',
                  name: 'Push Up',
                  difficulty_level: 'Beginner',
                  recommended_duration_seconds: 60,
                  estimated_calories_per_minutes: 5,
                  rep_range_min: 10,
                },
              ],
            },
          });
        case '/api/health-metrics/search':
          return Promise.resolve({ data: { data: [] } });
        default:
          return Promise.resolve({ data: {} });
      }
    });
  });

  it('appelle les routes utilisateur, IA, exercices et métriques de santé', async () => {
    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/users/search', expect.any(Object));
      expect(mockPost).toHaveBeenCalledWith('/api/ai/recommend', expect.any(Object));
      expect(mockPost).toHaveBeenCalledWith('/api/exercises/search', expect.any(Object));
      expect(mockPost).toHaveBeenCalledWith('/api/health-metrics/search', expect.any(Object));
    });
  });

  it('envoie un payload IA cohérent (age, bmi, niveau d\'activité, catégorie favorite)', async () => {
    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/ai/recommend', expect.any(Object));
    });

    const aiCall = mockPost.mock.calls.find((c) => c[0] === '/api/ai/recommend');
    expect(aiCall?.[1]).toEqual(
      expect.objectContaining({
        age: expect.any(Number),
        bmi: expect.any(Number),
        physical_activity_level: expect.any(String),
        favorite_exercise_category: expect.any(String),
      })
    );
  });

  it('ne déclenche aucun appel API quand il n\'y a pas d\'utilisateur', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
