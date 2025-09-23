// service/apiClient.ts
export const API_BASE_URL = "http://192.168.5.43:8000/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiFetchOptions {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  contentType?: string;
}

const apiFetchClient = async <T>({
  method,
  endpoint,
  data,
  contentType = "application/json",
}: ApiFetchOptions): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const empresaId =
    typeof window !== "undefined" ? localStorage.getItem("empresa_id") : null;

  let url = `${API_BASE_URL}${endpoint}`;
  if (empresaId) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}empresa_id=${empresaId}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method !== "GET" && data ? JSON.stringify(data) : undefined,
    });

    if (res.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        message: res.statusText,
        originalError: errorData,
      };
    }

    return res.json();
  } catch (error: any) {
    console.error("API fetch client error:", error);
    throw error;
  }
};

export default apiFetchClient;
