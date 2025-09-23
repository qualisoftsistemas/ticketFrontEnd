import React from "react";
import InputText from "@/components/ui/inputText";
import { Button } from "../ui/button";
import { loginAction } from "@/actions/login";

const LoginForm: React.FC = () => {
  return (
    <form
      action={loginAction}
      className="max-w-md w-full mx-auto rounded-lg bg-[var(--primary)]"
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

        <InputText
          label="Senha"
          type="password"
          name="senha"
          placeholder="..."
          labelColor="text-[var(--extra)]"
        />

        <Button type="submit" variant={"default"}>
          Entrar
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
