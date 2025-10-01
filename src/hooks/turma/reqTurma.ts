import { ITurmaCreate, ITurma, ITurmaAluno } from "@/Interfaces/ITurma";
import { API_BASE_URL } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useListarTurmasProfessor(professorId: string) {
  return useQuery<ITurma[]>({
    queryKey: ["turma", professorId],
    queryFn: () => reqListarTurmasProfessor(professorId),
  });
}
export function useListarTurmasAluno(studentId: string) {
  return useQuery<ITurmaAluno[]>({
    queryKey: ["turmaAluno", studentId],
    queryFn: () => reqListarTurmasAluno(studentId),
  });
}
export function useCriarTurma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reqCriarTurma,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["turma", variables.professorId] });
    },
  });
}
export function useDeleteTurma(professorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turma", professorId] });
    },
  });
}
export function useAddAluno(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token }: { token: string }) => addAluno(token, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmaAluno", studentId] });
    },
  });
}
export function useTurmaById(id: string) {
  return useQuery<ITurma>({
    queryKey: ["turmaById", id],
    queryFn: () => reqTurmaById(id),
    enabled: !!id,
  });
}

export function useUpdateTurma(professorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reqUpdateTurma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turma", professorId] });
    },
  });
}

export async function reqListarTurmasProfessor(professorId: string): Promise<ITurma[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas/professor/${professorId}`);
    const json = await response.json();
    if (response.ok && Array.isArray(json)) {
      return json as ITurma[];
    } else if (response.ok && Array.isArray(json.turmas)) {
      return json.turmas as ITurma[];
    } else {
      throw new Error(json.error || "Erro ao buscar turmas");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}

export async function reqListarTurmasAluno(studentId: string): Promise<ITurmaAluno[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas/student/${studentId}`);
    const json = await response.json();
    if (response.ok && Array.isArray(json)) {
      return json as ITurmaAluno[];
    } else if (response.ok && Array.isArray(json.turmas)) {
      return json.turmas as ITurmaAluno[];
    } else {
      throw new Error(json.error || "Erro ao buscar turmas");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}

export async function reqCriarTurma(data: ITurmaCreate): Promise<ITurma> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (response.ok) {
      return json.turma as ITurma;
    } else {
      throw new Error(json.error || "Erro ao criar turma");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}

export async function deleteTurma(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.error || "Erro ao deletar turma");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}

export async function addAluno(token: string, studentId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas/aluno`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, studentId }),
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.error || "Erro ao adicionar aluno");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}

export default async function reqTurmaById(id: string): Promise<ITurma> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas/${id}`);
    const json = await response.json();
    if (response.ok && json.turma) {
      return json.turma as ITurma;
    } else if (response.ok) {
      return json as ITurma;
    } else {
      throw new Error(json.error || "Erro ao buscar turma");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}

// Função para atualizar turma
export async function reqUpdateTurma(data: Partial<ITurma> & { id: number }): Promise<ITurma> {
  try {
    const response = await fetch(`${API_BASE_URL}/turmas/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (response.ok) {
      return json.turma as ITurma;
    } else {
      throw new Error(json.error || "Erro ao atualizar turma");
    }
  } catch (error: any) {
    throw new Error(error?.message || "Erro de conexão");
  }
}