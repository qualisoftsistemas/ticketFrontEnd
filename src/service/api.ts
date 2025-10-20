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

  const empresaStoreRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("empresa-store")
      : null;

  const conglomeradoSelecionadoRaw =
    typeof window !== "undefined"
      ? localStorage.getItem("conglomeradoSelecionado")
      : null;

  const userString =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  let prestadorId: string | null = null;
  if (userString) {
    try {
      const user = JSON.parse(userString);
      prestadorId = user?.prestador_id ?? null;
    } catch {}
  }

  let empresaId: string | null = null;
  let conglomeradoId: string | null = null;

  if (empresaStoreRaw) {
    try {
      const parsed = JSON.parse(empresaStoreRaw);
      empresaId = parsed?.state?.empresaSelecionada?.id ?? null;
      conglomeradoId = parsed?.state?.empresaSelecionada?.conglomerado?.id ?? null;
    } catch (err) {
      console.error("Erro ao parsear empresa-store:", err);
    }
  }

  if (conglomeradoSelecionadoRaw) {
    try {
      const parsed = JSON.parse(conglomeradoSelecionadoRaw);
      conglomeradoId = parsed?.id ?? null;
    } catch (err) {
      console.error("Erro ao parsear conglomeradoSelecionado:", err);
    }
  }

  const isChamadoEndpoint = endpoint.startsWith("/chamado");
  let url = `${API_BASE_URL}${endpoint}`;

  const appendParam = (key: string, value: string | null) => {
    if (!value) return;
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}${key}=${value}`;
  };

  if (empresaId && !isChamadoEndpoint) appendParam("empresa_id", empresaId);
  if (conglomeradoId) appendParam("conglomerado_id", conglomeradoId);
  if (prestadorId) appendParam("prestador_id", prestadorId);

  // 🟨 Monta headers e corpo
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
  } catch (error: unknown) {
    throw {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      originalError: error,
    };
  }
};

export default apiFetchClient;
