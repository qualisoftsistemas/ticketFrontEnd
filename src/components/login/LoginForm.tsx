"use client";

import React, { useState } from "react";
import InputText from "@/components/ui/inputText";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/service/api";
import { toastSuccess } from "@/utils/toastService";
import { showRequestToast } from "../ui/toast";

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
      showRequestToast("success", "Dados salvos com sucesso!");

      const data = await res.json();

      const token = data.login.access_token;
      const user = data.login.user;

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (user.tipo === "ADMIN" || user.tipo === "FUNCIONÁRIO") {
        router.push("/selecionar-empresa");
      } else {
        router.push("/conglomerado");
      }
    } catch (err: unknown) {
      showRequestToast("error", "Erro ao fazer login!");

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md w-full mx-auto rounded-lg bg-[var(--primary)]"
      onSubmit={handleLogin}
    >
      <div className="bg-[var(--secondary)] p-3 rounded-t-md">
        <h1 className="text-center text-2xl font-bold text-[var(--secondary-foreground)]">
          Autenticar
        </h1>
      </div>
      <div className="p-8 flex flex-col gap-4 items-center">
        <h2 className="text-center text-lg text-[var(--primary-foreground)]">
          Informe Suas Credenciais
        </h2>

        <InputText
          label="Login"
          name="login"
          placeholder="..."
          labelColor="text-[var(--extra)]"
        />
        {error && (
          <p className="text-[var(--destructive)] text-center text-sm">
            {error}
          </p>
        )}

        <InputText
          label="Senha"
          type="password"
          name="senha"
          placeholder="..."
          labelColor="text-[var(--extra)]"
        />

        <Button type="submit" variant={"default"} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
