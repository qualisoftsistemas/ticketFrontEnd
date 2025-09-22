import React from "react";
import InputText from "@/components/ui/inputText";
import { Button } from "../ui/button";
import { loginAction } from "@/actions/login";

const LoginForm: React.FC = () => {
  return (
    <form
      action={loginAction}
      className="max-w-md w-full mx-auto flex flex-col gap-4 p-8 rounded-lg shadow-md bg-[var(--neutral)]"
    >
      <h2 className="text-center text-2xl font-semibold text-[var(--primary)]">
        Login
      </h2>

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

      <Button type="submit" variant={"confirm"}>
        Entrar
      </Button>
    </form>
  );
};

export default LoginForm;
