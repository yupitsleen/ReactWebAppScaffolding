import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockProvider, useAuthService } from "./MockContext";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Set up localStorage mock before tests
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <MockProvider forceMock={true}>{children}</MockProvider>
);

describe("MockAuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const response = await result.current.login({
        email: "customer@example.com",
        password: "password123",
      });

      expect(response.user).toBeDefined();
      expect(response.user.email).toBe("customer@example.com");
      expect(response.user.userType).toBe("Customer");
      expect(response.user.isAuthenticated).toBe(true);
      expect(response.tokens).toBeDefined();
      expect(response.tokens.accessToken).toContain("mock_token_");

      // Verify localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "auth_tokens",
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "auth_user",
        expect.any(String)
      );
    });

    it("should reject invalid credentials", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      await expect(
        result.current.login({
          email: "invalid@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should login different user types", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const testUsers = [
        { email: "vendor@example.com", userType: "Vendor" },
        { email: "service@example.com", userType: "Service Provider" },
        { email: "admin@example.com", userType: "Admin" },
      ];

      for (const testUser of testUsers) {
        const response = await result.current.login({
          email: testUser.email,
          password: "password123",
        });

        expect(response.user.userType).toBe(testUser.userType);
      }
    });
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const registerData = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "newpassword123",
        userType: "Customer" as const,
        role: "Premium Customer",
      };

      const response = await result.current.register(registerData);

      expect(response.user).toBeDefined();
      expect(response.user.name).toBe("John Doe");
      expect(response.user.email).toBe("john.doe@example.com");
      expect(response.user.userType).toBe("Customer");
      expect(response.user.role).toBe("Premium Customer");
      expect(response.user.isAuthenticated).toBe(true);
    });

    it("should reject registration with existing email", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const registerData = {
        name: "Existing User",
        email: "customer@example.com", // This email already exists in mock data
        password: "password123",
        userType: "Customer" as const,
      };

      await expect(result.current.register(registerData)).rejects.toThrow(
        "User with this email already exists"
      );
    });

    it("should set default role when none provided", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const registerData = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password123",
        userType: "Vendor" as const,
      };

      const response = await result.current.register(registerData);

      expect(response.user.role).toBe("Vendor User");
    });
  });

  describe("logout", () => {
    it("should clear user data and tokens", async () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      await result.current.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_tokens");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_user");
    });
  });

  describe("getCurrentUser", () => {
    it("should return null when no user is stored", () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const user = result.current.getCurrentUser();
      expect(user).toBeNull();
    });

    it("should return user when stored in localStorage", () => {
      const mockUser = {
        id: "test-user",
        name: "Test User",
        email: "test@example.com",
        userType: "Customer",
        role: "Test Role",
        isAuthenticated: true,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      const user = result.current.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe("isAuthenticated", () => {
    it("should return false when no tokens are stored", () => {
      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isAuthenticated()).toBe(false);
    });

    it("should return false when tokens are expired", () => {
      const expiredTokens = {
        accessToken: "token",
        refreshToken: "refresh",
        expiresIn: Date.now() - 1000, // Expired 1 second ago
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredTokens));

      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isAuthenticated()).toBe(false);
    });

    it("should return true when tokens are valid", () => {
      const validTokens = {
        accessToken: "token",
        refreshToken: "refresh",
        expiresIn: Date.now() + 60000, // Expires in 1 minute
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(validTokens));

      const { result } = renderHook(() => useAuthService(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isAuthenticated()).toBe(true);
    });
  });
});
