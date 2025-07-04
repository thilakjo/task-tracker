// src/components/Login.test.js
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom"; // For extended matchers like .toBeInTheDocument()
import Login from "./Login";

// Mock localStorage for testing [cite: 10]
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Login Component", () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    localStorageMock.clear(); // Clear localStorage before each test
    mockOnLoginSuccess.mockClear(); // Clear mock calls
    cleanup(); // Unmounts React trees that were mounted with render
  });

  test("renders login form with username input and login button", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(
      screen.getByPlaceholderText(/Enter your username/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /Login to Task Tracker/i })
    ).toBeInTheDocument();
  });

  test("updates username input field on change", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput).toHaveValue("testuser");
  });

  test("calls onLoginSuccess and sets localStorage on valid login", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "validuser" } });
    fireEvent.click(loginButton);

    expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnLoginSuccess).toHaveBeenCalledWith("validuser");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "taskTrackerUsername",
      "validuser"
    );
  });

  test("does not call onLoginSuccess and shows alert if username is empty", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock window.alert
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.click(loginButton); // Click without entering username

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Please enter a username.");
    expect(mockOnLoginSuccess).not.toHaveBeenCalled(); // Should not have been called
    expect(localStorage.setItem).not.toHaveBeenCalled(); // Should not have been called
    alertMock.mockRestore(); // Restore original alert function
  });

  test("does not call onLoginSuccess and shows alert if username is just whitespace", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "   " } });
    fireEvent.click(loginButton);

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Please enter a username.");
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });
});
