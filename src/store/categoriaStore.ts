// stores/categoriaStore.ts
import { create } from "zustand";
import { Categoria } from "@/types/Categoria";
import apiFetchClient from "@/service/api";

interface CategoriaState {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  categoriaSelecionada: Categoria | null;

  fetchCategorias: () => Promise<void>;
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

  fetchCategorias: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<{ categorias: Categoria[] }>({
        method: "GET",
        endpoint: "/categoria",
      });
      set({ categorias: response.categorias || [], loading: false });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao buscar categorias",
        loading: false,
      });
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
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao buscar categoria", loading: false });
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
      set({ categorias: [...get().categorias, response], loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao criar categoria", loading: false });
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
      set({
        categorias: get().categorias.map((s) =>
          s.id === response.id ? response : s
        ),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao atualizar categoria",
        loading: false,
      });
    }
  },

  deleteCategoria: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/categoria/${id}`,
      });
      set({
        categorias: get().categorias.filter((s) => s.id !== id),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err.message || "Erro ao deletar categoria",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
