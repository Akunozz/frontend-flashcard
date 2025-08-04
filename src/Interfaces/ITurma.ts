
export interface IProfessor {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITurma {
  id: number;
  title: string;
  description?: string;
  token: string;
  professorId: string;
  createdAt: string;
  updatedAt: string;
  professor?: IProfessor;
  turmaAluno?: any[];
}

export interface ITurmaCreate {
  title: string;
  description?: string;
  professorId: string;
}

export interface ITurmaResponse {
  turma: ITurma;
  message?: string;
  error?: string;
}
