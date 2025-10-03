// service/apiClient.ts
export const API_BASE_URL = "http://192.168.5.43:8000/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiFetchOptions {
  method: HttpMethod;
  endpoint: string;
  // eslint-disable-next-line
  data?: any;
}

const apiFetchClient = async <T>({
  method,
  endpoint,
  data,
}: ApiFetchOptions): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const empresaStore =
    typeof window !== "undefined"
      ? localStorage.getItem("empresa-store")
      : null;

  let url = `${API_BASE_URL}${endpoint}`;

  if (empresaStore) {
    try {
      const parsed = JSON.parse(empresaStore);
      const empresaId = parsed?.state?.empresaSelecionada?.id;
      const conglomeradoId =
        parsed?.state?.empresaSelecionada?.conglomerado?.id;

      if (empresaId) {
        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}empresa_id=${empresaId}`;
      }

      if (conglomeradoId) {
        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}conglomerado_id=${conglomeradoId}`;
      }
    } catch (err) {
      console.error("Erro ao parsear empresa-store:", err);
    }
  }

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let body: BodyInit | undefined;

  if (method !== "GET" && data) {
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }
  }

  try {
    const res = await fetch(url, { method, headers, body });

    if (res.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        message: errorData.message || res.statusText,
        originalError: errorData,
      };
    }

    return res.json();
    // eslint-disable-next-line
  } catch (error: any) {
    console.error("API fetch client error:", error);
    throw error;
  }
};

export default apiFetchClient;
