import { render, screen } from "@testing-library/react-native";
import RootLayout from "../app/index";

jest.mock("../context/authContext", () => ({
  useAuth: () => ({ isAuthenticated: false, isLoading: true }),
}));

jest.mock("expo-router", () => ({
  Redirect: () => null,
  Slot: () => null,
  useRouter: () => ({ push: jest.fn() }),
}));

test("affiche l'écran de chargement quand l'auth est en cours", async () => {
  await render(<RootLayout />);
  expect(await screen.findByText("Loading...")).toBeTruthy();
});