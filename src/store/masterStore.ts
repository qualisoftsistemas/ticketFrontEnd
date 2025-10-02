import { create } from "zustand";
import { Master } from "@/types/Master";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";

interface MasterState {
  masters: Master[];
  loading: boolean;
  error: string | null;
  masterSelecionado: Master | null;
  pagination: Pagination | null;

  fetchMasters: (options?: { page?: number; search?: string }) => Promise<void>;
  fetchMasterById: (id: number) => Promise<void>;
  createMaster: (data: Partial<Master>) => Promise<void>;
  updateMaster: (data: Partial<Master>) => Promise<void>;
  deleteMaster: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useMasterStore = create<MasterState>((set, get) => ({
  masters: [],
  loading: false,
  error: null,
  masterSelecionado: null,
  pagination: null,

  fetchMasters: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/master?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        masters: Master[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        masters: response.masters || [],
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

  fetchMasterById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Master>({
        method: "GET",
        endpoint: `/master/${id}`,
      });
      set({ masterSelecionado: response, loading: false });
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

  createMaster: async (data: Partial<Master>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Master>({
        method: "POST",
        endpoint: "/master",
        data,
      });
      set({ masters: [...get().masters, response], loading: false });
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

  updateMaster: async (data: Partial<Master>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Master>({
        method: "PUT",
        endpoint: `/master/${data.id}`,
        data,
      });
      set({
        masters: get().masters.map((m) =>
          m.id === response.id ? response : m
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

  deleteMaster: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/master/${id}`,
      });
      set({
        masters: get().masters.filter((m) => m.id !== id),
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
