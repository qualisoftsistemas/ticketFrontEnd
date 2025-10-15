import { create } from "zustand";
import { Master, MasterApiResponse } from "@/types/Master";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";

interface MasterState {
  masters: Master[];
  loading: boolean;
  error: string | null;
  masterSelecionado: Master | null;
  pagination: Pagination | null;

  fetchMasters: (options?: fetchMasterOptions) => Promise<void>;
  fetchMasterById: (id: number) => Promise<void>;
  createMaster: (data: Partial<Master>) => Promise<void>;
  updateMaster: (data: Partial<Master>) => Promise<void>;
  deleteMaster: (id: number) => Promise<void>;
  toggleMaster: (id: number) => Promise<void>;
  clearError: () => void;
}

interface fetchMasterOptions {
  page?: number;
  nome?: string;
}

export const useMasterStore = create<MasterState>((set, get) => ({
  masters: [],
  loading: false,
  error: null,
  masterSelecionado: null,
  pagination: null,

  fetchMasters: async (options: fetchMasterOptions = { page: 1 }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/master?page=${options.page}`;
      if (options.nome) {
        endpoint += `&nome=${encodeURIComponent(options.nome)}`;
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
        set({
          error: err.message || "Erro ao buscar admin",
          loading: false,
        });
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
      showRequestToast("success", "Dados salvos com sucesso!");
      set({ masters: [...get().masters, response], loading: false });
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

  updateMaster: async (data: Partial<Master>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Master>({
        method: "PUT",
        endpoint: `/master/${data.id}`,
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        masters: get().masters.map((m) =>
          m.id === response.id ? response : m
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

  toggleMaster: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/master/toggle/${id}`,
      });
      set({
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
