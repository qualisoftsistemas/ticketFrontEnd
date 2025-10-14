import { create } from "zustand";
import { Conglomerado } from "@/types/Conglomerado";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";
import { useEmpresaStore } from "./empresaStore";

interface ConglomeradoState {
  conglomerados: Conglomerado[];
  loading: boolean;
  error: string | null;
  conglomeradoSelecionado: Conglomerado | null;

  pagination: Pagination | null;
  fetchConglomerados: (options?: FetchConglomeradoOptions) => Promise<void>;
  fetchConglomeradoById: (id: number) => Promise<void>;
  createConglomerado: (data: Partial<Conglomerado>) => Promise<void>;
  updateConglomerado: (data: Partial<Conglomerado>) => Promise<void>;
  deleteConglomerado: (id: number) => Promise<void>;
  toggleConglomerado: (id: number) => Promise<void>;
  setConglomeradoSelecionadoAndReload: (conglomerado: Conglomerado) => void;
  setConglomeradoSelecionado: (conglomerado: Conglomerado) => void;
  loadConglomeradoFromStorage: () => void;
  clearError: () => void;
}

interface FetchConglomeradoOptions {
  page?: number;
  nome?: string;
}

export const useConglomeradoStore = create<ConglomeradoState>((set, get) => ({
  conglomerados: [],
  loading: false,
  error: null,
  conglomeradoSelecionado: null,
  pagination: null,

  fetchConglomerados: async (
    options: FetchConglomeradoOptions = { page: 1 }
  ) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/conglomerado?page=${options.page || 1}`;
      if (options.nome) endpoint += `&nome=${encodeURIComponent(options.nome)}`;

      const response = await apiFetchClient<{
        conglomerados: Conglomerado[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        conglomerados: response.conglomerados || [],
        pagination: response.pagination || null,
        loading: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({
          error: err.message || "Erro ao buscar conglomerados",
          loading: false,
        });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  fetchConglomeradoById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Conglomerado>({
        method: "GET",
        endpoint: `/conglomerado/${id}`,
      });
      set({ conglomeradoSelecionado: response, loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        set({
          error: err.message || "Erro ao buscar conglomerado",
          loading: false,
        });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  createConglomerado: async (data: Partial<Conglomerado>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Conglomerado>({
        method: "POST",
        endpoint: "/conglomerado",
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        conglomerados: [...get().conglomerados, response],
        loading: false,
      });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao criar conglomerado");
      if (err instanceof Error) {
        console.error(err);
        set({
          error: err.message || "Erro ao criar conglomerado",
          loading: false,
        });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  updateConglomerado: async (data: Partial<Conglomerado>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Conglomerado>({
        method: "PUT",
        endpoint: `/conglomerado/${data.id}`,
        data,
      });
      showRequestToast("success", "Dados atualizados com sucesso!");
      set({
        conglomerados: get().conglomerados.map((c) =>
          c.id === response.id ? response : c
        ),
        loading: false,
      });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao atualizar conglomerado");
      if (err instanceof Error) {
        console.error(err);
        set({
          error: err.message || "Erro ao atualizar conglomerado",
          loading: false,
        });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  deleteConglomerado: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/conglomerado/${id}`,
      });
      showRequestToast("success", "Conglomerado excluído com sucesso!");
      set({
        conglomerados: get().conglomerados.filter((c) => c.id !== id),
        loading: false,
      });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao excluir conglomerado");
      if (err instanceof Error) {
        console.error(err);
        set({
          error: err.message || "Erro ao excluir conglomerado",
          loading: false,
        });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  toggleConglomerado: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/conglomerado/toggle/${id}`,
      });
      showRequestToast("success", "Status alterado com sucesso!");
      set({ loading: false });
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao alterar status");
      if (err instanceof Error) {
        console.error(err);
        set({ error: err.message || "Erro ao alterar status", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  setConglomeradoSelecionadoAndReload: (conglomerado: Conglomerado) => {
    set({ conglomeradoSelecionado: conglomerado });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "conglomeradoSelecionado",
        JSON.stringify(conglomerado)
      );
      window.location.reload();
    }
  },

  setConglomeradoSelecionado: (conglomerado: Conglomerado) => {
    set({ conglomeradoSelecionado: conglomerado });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "conglomeradoSelecionado",
        JSON.stringify(conglomerado)
      );
      useEmpresaStore.getState().setEmpresaSelecionada(null);

      localStorage.setItem("empresa-store", JSON.stringify(null));
    }
  },

  /**
   * Carrega o conglomerado salvo no localStorage (para usar no layout, por exemplo)
   */
  loadConglomeradoFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("conglomeradoSelecionado");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Conglomerado;
          set({ conglomeradoSelecionado: parsed });
        } catch (e) {
          console.error("Erro ao carregar conglomerado do storage:", e);
        }
      }
    }
  },

  clearError: () => set({ error: null }),
}));
