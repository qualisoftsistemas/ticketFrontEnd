"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/service/api";

export async function loginAction(formData: FormData) {
  const login = formData.get("login");
  const senha = formData.get("senha");

  if (!login || !senha) {
    throw new Error("Login e senha são obrigatórios.");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha }),
      cache: "no-store",
    });

    const data = await res.json();

    console.log(data);

    const token = data.login.access_token;
    const empresa_id = String(data.login.empresa_id);

    const cookieStore = cookies();
    (await cookieStore).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    (await cookieStore).set("empresa_id", empresa_id, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    redirect("/setor");
  } catch (error) {
    console.error("Login Server Action error:", error);
    throw error;
  }
}
