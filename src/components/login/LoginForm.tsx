"use client";

import React, { useState } from "react";
import InputText from "@/components/ui/inputText";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/service/api";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const login = formData.get("login") as string;
    const senha = formData.get("senha") as string;

    if (!login || !senha) {
      setError("Login e senha são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erro ao fazer login");
      }

      const data = await res.json();
      const token = data.login.access_token;
      const empresa_id = String(data.login.empresa_id);

      localStorage.setItem("token", token);
      localStorage.setItem("empresa_id", empresa_id);

      router.push("/setor");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md w-full mx-auto flex flex-col gap-4 p-8 rounded-lg shadow-md bg-[var(--neutral)]"
    >
      <h2 className="text-center text-2xl font-semibold text-[var(--primary)]">
        Login
      </h2>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      <InputText
        label="Nome de Usuário"
        name="login"
        placeholder="Digite seu usuário"
      />

      <InputText
        label="Senha"
        type="password"
        name="senha"
        placeholder="Digite sua senha"
      />

      <Button type="submit" variant={"confirm"} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default LoginForm;
