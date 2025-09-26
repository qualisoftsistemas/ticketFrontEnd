import { create } from "zustand";
import { Funcionario } from "@/types/Funcionario";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";

interface FuncionarioState {
  funcionarios: Funcionario[];
  loading: boolean;
  error: string | null;
  funcionarioSelecionado: Funcionario | null;
  pagination: Pagination | null;

  fetchFuncionarios: (options?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  fetchFuncionarioById: (id: number) => Promise<void>;
  createFuncionario: (data: Partial<Funcionario>) => Promise<void>;
  updateFuncionario: (data: Partial<Funcionario>) => Promise<void>;
  deleteFuncionario: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useFuncionarioStore = create<FuncionarioState>((set, get) => ({
  funcionarios: [],
  loading: false,
  error: null,
  funcionarioSelecionado: null,
  pagination: null,

  fetchFuncionarios: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/funcionario?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        funcionarios: Funcionario[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        funcionarios: response.funcionarios || [],
        pagination: response.pagination || null,
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao buscar funcionarios",
        loading: false,
      });
    }
  },

  fetchFuncionarioById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Funcionario>({
        method: "GET",
        endpoint: `/funcionario/${id}`,
      });
      set({ funcionarioSelecionado: response, loading: false });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao buscar funcionario",
        loading: false,
      });
    }
  },

  createFuncionario: async (data: Partial<Funcionario>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Funcionario>({
        method: "POST",
        endpoint: "/funcionario",
        data,
      });
      set({ funcionarios: [...get().funcionarios, response], loading: false });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao criar funcionario",
        loading: false,
      });
    }
  },

  updateFuncionario: async (data: Partial<Funcionario>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Funcionario>({
        method: "PUT",
        endpoint: `/funcionario/${data.id}`,
        data,
      });
      set({
        funcionarios: get().funcionarios.map((f) =>
          f.id === response.id ? response : f
        ),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao atualizar funcionario",
        loading: false,
      });
    }
  },

  deleteFuncionario: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/funcionario/${id}`,
      });
      set({
        funcionarios: get().funcionarios.filter((f) => f.id !== id),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao deletar funcionario",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
