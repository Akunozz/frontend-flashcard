export type ILogin = {
  name?: string;
  email: string;
  password: string;
  role: "STUDENT" | "PROFESSOR";
};
