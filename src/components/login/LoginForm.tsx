"use client";
import React, { useState } from "react";
import InputText from "@/components/ui/inputText";
import { Button } from "../ui/button";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuário:", username);
    console.log("Senha:", password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto flex flex-col gap-4 p-8 rounded-lg shadow-md bg-[var(--neutral)]"
    >
      <h2 className="text-center text-2xl font-semibold text-[var(--primary)]">
        Login
      </h2>

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
        icon={<img src="/icons/check.svg" alt="check" className="w-5 h-5" />}
        iconPosition="right"
        bgIcon="bg-[var(--success)]"
      />

      <Button type="submit" variant={"confirm"}>
        Entrar
      </Button>
    </form>
  );
};

export default LoginForm;
