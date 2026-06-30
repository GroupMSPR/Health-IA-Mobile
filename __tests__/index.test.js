import { render } from "@testing-library/react-native";
import LoginScreen from "../app/index";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

test("renders login screen", () => {
  const { getByText } = render(<LoginScreen />);
  expect(getByText("Login")).toBeTruthy();
});