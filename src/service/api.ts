import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const API_BASE_URL = "http://192.168.5.43:8000/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiFetchOptions {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  contentType?: string;
}

const apiFetchServer = async <T>({
  method,
  endpoint,
  data,
  contentType = "application/json",
}: ApiFetchOptions): Promise<T> => {
  const token = (await cookies()).get("token")?.value;
  const empresaId = (await cookies()).get("empresa_id")?.value;

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
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
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
    console.error("API fetch error:", error);
    throw error;
  }
};

export default apiFetchServer;
