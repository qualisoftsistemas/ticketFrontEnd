import { create } from "zustand";
import { Empresa } from "@/types/Empresa";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";

interface EmpresaState {
  empresas: Empresa[];
  loading: boolean;
  error: string | null;
  empresaSelecionada: Empresa | null;
  pagination: Pagination | null;
  fetchEmpresas: (options?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  fetchEmpresaById: (id: number) => Promise<void>;
  createEmpresa: (data: Partial<Empresa>) => Promise<void>;
  updateEmpresa: (data: Partial<Empresa>) => Promise<void>;
  deleteEmpresa: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useEmpresaStore = create<EmpresaState>((set, get) => ({
  empresas: [],
  loading: false,
  error: null,
  empresaSelecionada: null,
  pagination: null,

  fetchEmpresas: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/empresa?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        empresas: Empresa[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        empresas: response.empresas || [],
        pagination: response.pagination || null,
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao buscar empresas",
        loading: false,
      });
    }
  },

  fetchEmpresaById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Empresa>({
        method: "GET",
        endpoint: `/empresa/${id}`,
      });
      set({ empresaSelecionada: response, loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao buscar empresa", loading: false });
    }
  },

  createEmpresa: async (data: Partial<Empresa>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Empresa>({
        method: "POST",
        endpoint: "/empresa",
        data,
      });
      set({ empresas: [...get().empresas, response], loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao criar empresa", loading: false });
    }
  },

  updateEmpresa: async (data: Partial<Empresa>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Empresa>({
        method: "PUT",
        endpoint: `/empresa/${data.id}`,
        data,
      });
      set({
        empresas: get().empresas.map((e) =>
          e.id === response.id ? response : e
        ),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao atualizar empresa",
        loading: false,
      });
    }
  },

  deleteEmpresa: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/empresa/${id}`,
      });
      set({
        empresas: get().empresas.filter((e) => e.id !== id),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao deletar empresa",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
