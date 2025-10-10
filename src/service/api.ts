// service/apiClient.ts
export const API_BASE_URL = "http://192.168.5.46:8000/api";

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

  const userString = localStorage.getItem("user");
  let prestadorId: string | null = null;

  if (userString) {
    try {
      const user = JSON.parse(userString);
      prestadorId = user.prestador_id;
    } catch (err) {}
  }

  const isChamadoEndpoint = endpoint.startsWith("/chamado");
  let url = `${
    isChamadoEndpoint ? `${API_BASE_URL}` : API_BASE_URL
  }${endpoint}`;

  if (empresaStore) {
    try {
      const parsed = JSON.parse(empresaStore);
      const empresaId = parsed?.state?.empresaSelecionada?.id;
      const conglomeradoId =
        parsed?.state?.empresaSelecionada?.conglomerado?.id;

      const separator = url.includes("?") ? "&" : "?";

      if (isChamadoEndpoint) {
        if (conglomeradoId) {
          url += `${separator}conglomerado_id=${conglomeradoId}`;
        }
      } else {
        if (empresaId) url += `${separator}empresa_id=${empresaId}`;

        if (conglomeradoId) {
          const sep = url.includes("?") ? "&" : "?";
          url += `${sep}conglomerado_id=${conglomeradoId}`;
        }
      }
    } catch (err) {
      console.error("Erro ao parsear empresa-store:", err);
    }
  }

  if (userString) {
    const separator = url.includes("?") ? "&" : "?";

    if (prestadorId) {
      url += `${separator}prestador_id=${prestadorId}`;
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
