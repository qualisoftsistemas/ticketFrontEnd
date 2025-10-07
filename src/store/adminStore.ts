import { create } from "zustand";
import { Admin } from "@/types/Admin";
import apiFetchClient from "@/service/api";
import { Pagination } from "@/types/Pagination";
import { showRequestToast } from "@/components/ui/toast";

interface AdminState {
  admins: Admin[];
  loading: boolean;
  error: string | null;
  adminSelecionado: Admin | null;
  pagination: Pagination | null;

  fetchAdmins: (options?: { page?: number; search?: string }) => Promise<void>;
  fetchAdminById: (id: number) => Promise<void>;
  createAdmin: (data: Partial<Admin>) => Promise<void>;
  updateAdmin: (data: Partial<Admin>) => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  admins: [],
  loading: false,
  error: null,
  adminSelecionado: null,
  pagination: null,

  fetchAdmins: async (options = { page: 1, search: "" }) => {
    set({ loading: true, error: null });
    try {
      let endpoint = `/admin?page=${options.page}`;
      if (options.search) {
        endpoint += `&search=${encodeURIComponent(options.search)}`;
      }

      const response = await apiFetchClient<{
        admins: Admin[];
        pagination: Pagination;
      }>({
        method: "GET",
        endpoint,
      });

      set({
        admins: response.admins || [],
        pagination: response.pagination || null,
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

  fetchAdminById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<{ admin: Admin }>({
        method: "GET",
        endpoint: `/admin/${id}`,
      });
      set({ adminSelecionado: response.admin, loading: false });
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

  createAdmin: async (data: Partial<Admin>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Admin>({
        method: "POST",
        endpoint: "/admin",
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({ admins: [...get().admins, response], loading: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        showRequestToast("error", err.message || "Erro ao buscar admins");
        console.error(err);
        set({ error: err.message || "Erro ao buscar admins", loading: false });
      } else {
        console.error(err);
        set({ error: "Erro desconhecido", loading: false });
      }
    }
  },

  updateAdmin: async (data: Partial<Admin>) => {
    if (!data.id) return;
    set({ loading: true, error: null });
    try {
      const response = await apiFetchClient<Admin>({
        method: "PUT",
        endpoint: `/admin/${data.id}`,
        data,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({
        admins: get().admins.map((a) => (a.id === response.id ? response : a)),
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

  deleteAdmin: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiFetchClient({
        method: "DELETE",
        endpoint: `/admin/${id}`,
      });
      showRequestToast("success", "Dados salvos com sucesso!");
      set({ admins: get().admins.filter((a) => a.id !== id), loading: false });
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
