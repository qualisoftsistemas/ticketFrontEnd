// stores/chamadoStore.ts
import { create } from "zustand";
import { Chamado, ChamadoApiResponse } from "@/types/Chamado";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";
import { StatusQtde } from "@/components/chamados/FilterBox";
interface ChamadoState {
  chamados: Chamado[];
  loading: boolean;
  error: string | null;
  chamadoSelecionado: ChamadoApiResponse | null;
  pagination: Pagination | null;
  statusQtde: StatusQtde | null;

  fetchChamados: (options?: FetchChamadosOptions) => Promise<void>;
  fetchChamadoById: (id: number) => Promise<void>;
  createChamado: (data: Partial<Chamado>) => Promise<void>;
  updateChamado: (data: Partial<Chamado>) => Promise<void>;
  deleteChamado: (id: number) => Promise<void>;
  clearError: () => void;
}

interface FetchChamadosOptions {
  page?: number;
  search?: string;
  status?: string[];
  assunto?: string;
  setor_id?: number | null;
  operador_id?: number | null;
  categoria_id?: number | null;
  empresa_id?: number | null;
}

export const useChamadoStore = create<ChamadoState>((set, get) => ({
  chamados: [],
  loading: false,
  error: null,
  chamadoSelecionado: null,
  pagination: null,
  statusQtde: null,

  fetchChamados: async (
    options: FetchChamadosOptions = { page: 1, status: [] }
  ) => {
    set({ loading: true, error: null });
    try {
      let query = new URLSearchParams();
      query.set("page", String(options.page ?? 1));

      if (options.assunto) query.set("assunto", options.assunto);

      if (options.setor_id != null)
        query.set("setor_id", String(options.setor_id));
      if (options.operador_id != null)
        query.set("operador_id", String(options.operador_id));
      if (options.categoria_id != null)
        query.set("categoria_id", String(options.categoria_id));
      if (options.empresa_id != null)
        query.set("empresa_id", String(options.empresa_id));

      if (options.status && options.status.length > 0) {
        options.status.forEach((s) => query.append("status[]", s));
      }

      const endpoint = `/chamado?${query.toString()}`;

      const response = await apiFetchClient<{
        chamados: Chamado[];
        pagination: Pagination;
        status_counts: Record<string, number>;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        chamados: response.chamados || [],
        pagination: response.pagination || null,
        statusQtde: response.status_counts || null,
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        error: err instanceof Error ? err.message : "Erro desconhecido",
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

  createChamado: async (data: Partial<Chamado>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Chamado>({
        method: "POST",
        endpoint: "/chamado",
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        chamados: [...get().chamados, response],
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

  updateChamado: async (data: Partial<Chamado>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Chamado>({
        method: "PUT",
        endpoint: `/chamado/${data.id}`,
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        chamados: get().chamados.map((c) =>
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

  deleteChamado: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/chamado/${id}`,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        chamados: get().chamados.filter((c) => c.id !== id),
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
