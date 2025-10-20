import { create } from "zustand";
import { Operador } from "@/types/Operador";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";

interface OperadorState {
  operadores: Operador[];
  loading: boolean;
  error: string | null;
  operadorSelecionado: Operador | null;
  pagination: Pagination | null;

  fetchOperadores: (options?: FetchOperadorOptions) => Promise<void>;
  fetchOperadorById: (id: number) => Promise<void>;
  createOperador: (data: Partial<Operador>) => Promise<void>;
  updateOperador: (data: Partial<Operador>) => Promise<void>;
  toggleOperador: (id: number) => Promise<void>;
  deleteOperador: (id: number) => Promise<void>;
  clearError: () => void;
}

interface FetchOperadorOptions {
  page?: number;
  nome?: string;
}

export const useOperadorStore = create<OperadorState>((set, get) => ({
  operadores: [],
  loading: false,
  error: null,
  operadorSelecionado: null,
  pagination: null,

  fetchOperadores: async (options: FetchOperadorOptions = { page: 1 }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/operador?page=${options.page}`;
      if (options.nome) {
        endpoint += `&nome=${encodeURIComponent(options.nome)}`;
      }

      const response = await apiFetchClient<{
        operadores: Operador[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        operadores: response.operadores || [],
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

  fetchOperadorById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<{ operador: Operador }>({
        method: "GET",
        endpoint: `/operador/${id}`,
      });
      set({ operadorSelecionado: response.operador, loading: false });
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

  createOperador: async (data: Partial<Operador>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Operador>({
        method: "POST",
        endpoint: "/operador",
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({ operadores: [...get().operadores, response], loading: false });
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

  updateOperador: async (data: Partial<Operador>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Operador>({
        method: "PUT",
        endpoint: `/operador/${data.id}`,
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        operadores: get().operadores.map((o) =>
          o.id === response.id ? response : o
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

  deleteOperador: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/operador/${id}`,
      });
      set({
        operadores: get().operadores.filter((o) => o.id !== id),
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

  toggleOperador: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/operador/toggle/${id}`,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({ loading: false });
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
