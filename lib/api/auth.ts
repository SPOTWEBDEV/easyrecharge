import { delay } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data/account";
import { User } from "@/lib/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * All functions below simulate network latency and return shapes that mirror
 * a real REST/GraphQL response. Swap the internals for real `fetch` calls to
 * your backend later — signatures stay the same, so the UI never changes.
 */
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await delay(1100);
    if (!payload.email || !payload.password) {
      throw new Error("Email and password are required.");
    }
    return { user: mockUser, token: "mock_jwt_token_" + Date.now() };
  },

  async register(payload: RegisterPayload): Promise<{ requiresOtp: boolean; phone: string }> {
    await delay(1200);
    if (!payload.email || !payload.phone) {
      throw new Error("Missing required fields.");
    }
    return { requiresOtp: true, phone: payload.phone };
  },

  async verifyOtp(code: string): Promise<AuthResponse> {
    await delay(900);
    if (code.length !== 6) {
      throw new Error("Enter the full 6-digit code.");
    }
    if (code !== "123456") {
      throw new Error("Incorrect code. Please try again.");
    }
    return { user: mockUser, token: "mock_jwt_token_" + Date.now() };
  },

  async resendOtp(phone: string): Promise<{ sent: boolean }> {
    await delay(700);
    return { sent: true };
  },

  async forgotPassword(email: string): Promise<{ sent: boolean }> {
    await delay(900);
    return { sent: true };
  },

  async logout(): Promise<{ success: boolean }> {
    await delay(300);
    return { success: true };
  },
};
