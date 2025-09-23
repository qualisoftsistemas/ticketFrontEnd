// stores/setorStore.ts
import { create } from "zustand";
import { Setor } from "@/types/Setor";
import apiFetchClient from "@/service/api";

interface SetorState {
  setores: Setor[];
  loading: boolean;
  error: string | null;
  setorSelecionado: Setor | null;

  fetchSetores: () => Promise<void>;
  fetchSetorById: (id: number) => Promise<void>;
  createSetor: (data: Partial<Setor>) => Promise<void>;
  updateSetor: (data: Partial<Setor>) => Promise<void>;
  deleteSetor: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useSetorStore = create<SetorState>((set, get) => ({
  setores: [],
  loading: false,
  error: null,
  setorSelecionado: null,

  fetchSetores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<{ setores: Setor[] }>({
        method: "GET",
        endpoint: "/setor",
      });
      set({ setores: response.setores || [], loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao buscar setores", loading: false });
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
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao buscar setor", loading: false });
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
      set({ setores: [...get().setores, response], loading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao criar setor", loading: false });
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
      set({
        setores: get().setores.map((s) =>
          s.id === response.id ? response : s
        ),
        loading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao atualizar setor", loading: false });
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
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Erro ao deletar setor", loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
