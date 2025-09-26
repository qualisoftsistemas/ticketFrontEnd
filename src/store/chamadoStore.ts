// stores/chamadoStore.ts
import { create } from "zustand";
import { Chamado, ChamadoApiResponse } from "@/types/Chamado";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";

interface ChamadoState {
  chamados: Chamado[];
  loading: boolean;
  error: string | null;
  chamadoSelecionado: ChamadoApiResponse | null;
  pagination: Pagination | null;

  fetchChamados: (options?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  fetchChamadoById: (id: number) => Promise<void>;
  createChamado: (data: Partial<Chamado>) => Promise<void>;
  updateChamado: (data: Partial<Chamado>) => Promise<void>;
  deleteChamado: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useChamadoStore = create<ChamadoState>((set, get) => ({
  chamados: [],
  loading: false,
  error: null,
  chamadoSelecionado: null,
  pagination: null,

  fetchChamados: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/chamado?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        chamados: Chamado[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        chamados: response.chamados || [],
        pagination: response.pagination || null,
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao buscar chamados",
        loading: false,
      });
    }
  },

  fetchChamadoById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<ChamadoApiResponse>({
        method: "GET",
        endpoint: `/chamado/${id}`,
      });
      set({ chamadoSelecionado: response, loading: false });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao buscar chamado",
        loading: false,
      });
    }
  },

  createChamado: async (data: Partial<Chamado>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Chamado>({
        method: "POST",
        endpoint: "/chamado",
        data,
      });
      set({
        chamados: [...get().chamados, response],
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao criar chamado",
        loading: false,
      });
    }
  },

  updateChamado: async (data: Partial<Chamado>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Chamado>({
        method: "PUT",
        endpoint: `/chamado/${data.id}`,
        data,
      });
      set({
        chamados: get().chamados.map((c) =>
          c.id === response.id ? response : c
        ),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao atualizar chamado",
        loading: false,
      });
    }
  },

  deleteChamado: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/chamado/${id}`,
      });
      set({
        chamados: get().chamados.filter((c) => c.id !== id),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao deletar chamado",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
