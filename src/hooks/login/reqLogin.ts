import { API_BASE_URL } from "@/lib/api";
import { ILogin, LoginResponse } from "@/Interfaces/ILogin";

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
      const json = await response.json();
      throw new Error(json.message || json.error || "Erro ao fazer login");
    }
  } catch (error: any) {
    return { error: error.message };
  }
}