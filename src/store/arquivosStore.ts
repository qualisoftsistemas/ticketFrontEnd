import { create } from "zustand";
import apiFetchClient from "@/service/api";
import { Rotina, Upload } from "@/types/Arquivo";

interface RotinaState {
  rotinas: Rotina[];
  uploads: Upload[];
  loading: boolean;
  error: string | null;

  fetchRotinas: (mes?: number, ano?: number) => Promise<void>;
  uploadRotina: (data: {
    mes: string;
    ano: string;
    conglomerado_id: number;
    empresa_id: number;
    rotina_id: number;
    arquivo_id: number;
    observacao?: string;
  }) => Promise<void>;

  dispensarMes: (data: {
    mes: string;
    ano: string;
    conglomerado_id: number;
    empresa_id: number;
    rotina_id: number;
    observacao: string;
  }) => Promise<void>;

  clearError: () => void;
}

export const useRotinaStore = create<RotinaState>((set, get) => ({
  rotinas: [],
  uploads: [],
  loading: false,
  error: null,

  fetchRotinas: async (mes?: number, ano?: number) => {
    set({ loading: true, error: null });
    try {
      let endpoint = "/rotina";
      if (mes && ano) {
        endpoint += `?mes=${mes}&ano=${ano}`;
      }

      const response = await apiFetchClient<{
        rotina: Rotina[];
        uploads: Upload[];
      }>({
        method: "GET",
        endpoint,
      });

      set({
        rotinas: response.rotina || [],
        uploads: response.uploads || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Erro ao carregar rotinas.",
        loading: false,
      });
    }
  },

  uploadRotina: async (data) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "POST",
        endpoint: "/rotina",
        data,
      });
      await get().fetchRotinas();
    } catch (error: any) {
      set({
        error: error.message || "Erro ao enviar rotina.",
        loading: false,
      });
    } finally {
      set({ loading: false });
    }
  },

  dispensarMes: async (data) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: "/rotina",
        data,
      });
      await get().fetchRotinas();
    } catch (error: any) {
      set({
        error: error.message || "Erro ao dispensar rotina.",
        loading: false,
      });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
