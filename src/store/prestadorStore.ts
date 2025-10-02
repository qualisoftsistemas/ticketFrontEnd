import { create } from "zustand";
import { Prestador } from "@/types/Prestador";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";

interface PrestadorState {
  prestadores: Prestador[];
  loading: boolean;
  error: string | null;
  prestadorSelecionado: Prestador | null;
  pagination: Pagination | null;

  fetchPrestadores: (options?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  fetchPrestadorById: (id: number) => Promise<void>;
  createPrestador: (data: Partial<Prestador>) => Promise<void>;
  updatePrestador: (data: Partial<Prestador>) => Promise<void>;
  deletePrestador: (id: number) => Promise<void>;
  clearError: () => void;
}

export const usePrestadorStore = create<PrestadorState>((set, get) => ({
  prestadores: [],
  loading: false,
  error: null,
  prestadorSelecionado: null,
  pagination: null,

  fetchPrestadores: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/prestador?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        prestadores: Prestador[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        prestadores: response.prestadores || [],
        pagination: response.pagination || null,
        loading: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  fetchPrestadorById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Prestador>({
        method: "GET",
        endpoint: `/prestador/${id}`,
      });
      set({ prestadorSelecionado: response, loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  createPrestador: async (data: Partial<Prestador>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Prestador>({
        method: "POST",
        endpoint: "/prestador",
        data,
      });
      set({ prestadores: [...get().prestadores, response], loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  updatePrestador: async (data: Partial<Prestador>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Prestador>({
        method: "PUT",
        endpoint: `/prestador/${data.id}`,
        data,
      });
      set({
        prestadores: get().prestadores.map((p) =>
          p.id === response.id ? response : p
        ),
        loading: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  deletePrestador: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/prestador/${id}`,
      });
      set({
        prestadores: get().prestadores.filter((p) => p.id !== id),
        loading: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  clearError: () => set({ error: null }),
}));
