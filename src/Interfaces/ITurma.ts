export interface IProfessor {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITurmaAluno {
  id: number;
  turmaId: number;
  studentId: string;
  joinedAt: string;
  turma: ITurma;
  professor?: IProfessor;
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
  turmaAluno?: ITurmaAluno;
  alunosCount?: number;
  decksCount?: number;
  _count?: {
    turmaAluno?: number;
    decks?: number;
  };
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
