import { API_BASE_URL } from "@/lib/api";
import type { ILogin } from "@/Interfaces/ILogin";
import ICadastro from "@/Interfaces/ICadastro";

type Role = ILogin["role"];


export async function reqCadastro(
  name: ILogin["name"],
  email: ILogin["email"],
  password: ILogin["password"],
  role: Role
): Promise<ICadastro> {
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
      return { user: data.user, message: data.message };
    } else {
      const error = await response.text();
      return { error };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}
