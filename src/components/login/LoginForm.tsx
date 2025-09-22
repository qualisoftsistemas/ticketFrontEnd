"use client";
import React, { useState } from "react";
import InputText from "@/components/ui/inputText";
import { Button } from "../ui/button";
import { API_BASE_URL } from "@/service/api";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, senha: password }),
        cache: "no-store",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erro ao logar");
      }

      const data = await res.json();

      console.log(data);

      sessionStorage.setItem("token", data.login.access_token);
      // sessionStorage.setItem("empresa_id", String(data.login.empresa_id));

      console.log("Login realizado com sucesso!", data);
      // window.location.href = "/setor";
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto flex flex-col gap-4 p-8 rounded-lg shadow-md bg-[var(--neutral)]"
    >
      <h2 className="text-center text-2xl font-semibold text-[var(--primary)]">
        Login
      </h2>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      <InputText
        label="Nome de Usuário"
        value={username}
        onChange={setUsername}
        placeholder="Digite seu usuário"
      />

      <InputText
        label="Senha"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Digite sua senha"
      />

      <Button type="submit" variant={"confirm"} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default LoginForm;
