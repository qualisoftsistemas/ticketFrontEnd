// stores/setorStore.ts
import { create } from "zustand";
import { Setor } from "@/types/Setor";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";

interface SetorState {
  setores: Setor[];
  loading: boolean;
  error: string | null;
  setorSelecionado: Setor | null;
  pagination: Pagination | null;

  fetchSetores: (options?: FetchSetoresOptions) => Promise<void>;
  fetchSetorById: (id: number) => Promise<void>;
  createSetor: (data: Partial<Setor>) => Promise<void>;
  updateSetor: (data: Partial<Setor>) => Promise<void>;
  deleteSetor: (id: number) => Promise<void>;
  clearError: () => void;
}

interface FetchSetoresOptions {
  page?: number;
  withPagination?: boolean;
  nome?: string;
}

export const useSetorStore = create<SetorState>((set, get) => ({
  setores: [],
  loading: false,
  error: null,
  setorSelecionado: null,
  pagination: null,

  fetchSetores: async (options: FetchSetoresOptions = { page: 1 }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = "/setor";

      if (options.withPagination) {
        endpoint += `?page=${options.page}`;
      }

      if (options.nome) {
        endpoint += `&nome=${encodeURIComponent(options.nome)}`;
      }

      const response = await apiFetchClient<{
        setores: Setor[];
        pagination?: Pagination;
      }>({
        method: "GET",
        endpoint: endpoint,
      });

      set({
        setores: response.setores || [],
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

  fetchSetorById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Setor>({
        method: "GET",
        endpoint: `/setor/${id}`,
      });
      set({ setorSelecionado: response, loading: false });
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

  createSetor: async (data: Partial<Setor>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Setor>({
        method: "POST",
        endpoint: "/setor",
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({ setores: [...get().setores, response], loading: false });
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

  updateSetor: async (data: Partial<Setor>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Setor>({
        method: "PUT",
        endpoint: "/setor/" + data.id,
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        setores: get().setores.map((s) =>
          s.id === response.id ? response : s
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

  deleteSetor: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/setor/${id}`,
      });
      set({
        setores: get().setores.filter((s) => s.id !== id),
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
