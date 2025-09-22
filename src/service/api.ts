export const API_BASE_URL = "http://192.168.5.43:8000/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiFetchOptions {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  contentType?: string;
}

/**
 * Função genérica para chamadas API usando fetch padrão do Next.js.
 * Faz cacheamento usando 'next: { revalidate: 60 }' para SSR/ISR.
 */
const apiFetch = async <T>({
  method,
  endpoint,
  data,
  contentType = "application/json",
}: ApiFetchOptions): Promise<T> => {
  const empresaId = sessionStorage.getItem("empresa_id");
  const token = sessionStorage.getItem("token");

  const url =
    `${API_BASE_URL}${endpoint}` +
    (empresaId ? `?empresa_id=${empresaId}` : "");

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method !== "GET" && data ? JSON.stringify(data) : undefined,
      cache: method === "GET" ? "force-cache" : "no-store",
      next: { revalidate: 60 },
    });

    if (res.status === 401) {
      window.location.href = "/login";
      throw new Error("unauthorized");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const status = errorData?.status;
      throw {
        title: status?.title || "Erro",
        message: status?.message?.body || res.statusText,
        originalError: errorData,
      };
    }

    return res.json();
  } catch (error: any) {
    console.error("API fetch error:", error);
    throw error;
  }
};

export default apiFetch;
