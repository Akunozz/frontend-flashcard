
type Role = "ALUNO" | "PROFESSOR";

interface LoginResponse {
  token?: string;
  error?: string;
}

export async function reqLogin(email: string, password: string, role: Role): Promise<LoginResponse> {
  try {
    const response = await fetch("http://localhost:3001/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
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
