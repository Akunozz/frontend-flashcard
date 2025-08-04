export interface ILogin {
  name?: string;
  email: string;
  password: string;
  role: "STUDENT" | "PROFESSOR";
}

export interface LoginResponse {
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
