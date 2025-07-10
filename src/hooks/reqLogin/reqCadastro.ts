import { API_BASE_URL } from "@/lib/api";
import type { ILogin } from "@/Interfaces/ILogin";

type Role = ILogin["role"];

interface CadastroResponse {
  token?: string;
  error?: string;
}

export async function reqCadastro(
  name: ILogin["name"],
  email: ILogin["email"],
  password: ILogin["password"],
  role: Role
): Promise<CadastroResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (response.ok) {
      const data = await response.json();
      return { token: data.token };
    } else {
      const error = await response.text();
      return { error };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}
