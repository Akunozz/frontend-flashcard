import { API_BASE_URL } from "@/lib/api";
import type { ILogin } from "@/Interfaces/ILogin";

interface LoginResponse {
  access_token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message?: string;
  error?: string;
}

export async function reqLogin(
  email: ILogin["email"],
  password: ILogin["password"],
  role: ILogin["role"]
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        access_token: data.access_token,
        user: data.user,
        message: data.message,
      };
    } else {
      const error = await response.text();
      return { error };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}