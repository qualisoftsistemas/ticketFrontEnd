import { create } from "zustand";
import { Categoria } from "@/types/Categoria";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";

interface CategoriaState {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  categoriaSelecionada: Categoria | null;
  pagination: Pagination | null;
  fetchCategorias: (options?: {
    page?: number;
    search?: string;
  }) => Promise<void>;
  fetchCategoriaById: (id: number) => Promise<void>;
  createCategoria: (data: Partial<Categoria>) => Promise<void>;
  updateCategoria: (data: Partial<Categoria>) => Promise<void>;
  deleteCategoria: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCategoriaStore = create<CategoriaState>((set, get) => ({
  categorias: [],
  loading: false,
  error: null,
  categoriaSelecionada: null,
  pagination: null,

  fetchCategorias: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/categoria?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        categorias: Categoria[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        categorias: response.categorias || [],
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

  fetchCategoriaById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Categoria>({
        method: "GET",
        endpoint: `/categoria/${id}`,
      });
      set({ categoriaSelecionada: response, loading: false });
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

  createCategoria: async (data: Partial<Categoria>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Categoria>({
        method: "POST",
        endpoint: "/categoria",
        data,
      });

      showRequestToast("success", "Dados salvos com sucesso!");
      set({ categorias: [...get().categorias, response], loading: false });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao buscar admins");
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  updateCategoria: async (data: Partial<Categoria>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Categoria>({
        method: "PUT",
        endpoint: "/categoria/" + data.id,
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        categorias: get().categorias.map((c) =>
          c.id === response.id ? response : c
        ),
        loading: false,
      });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao buscar admins");
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  deleteCategoria: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/categoria/${id}`,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        categorias: get().categorias.filter((c) => c.id !== id),
        loading: false,
      });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao buscar admins");
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
