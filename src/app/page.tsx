import LoginForm from "@/components/login/LoginForm";
import React from "react";

const LoginPage = () => {
  return (
    <div className="relative flex items-center justify-center h-screen p-2">
      <img
        src="images/landing_page.webp"
        alt="Imagem de Fundo"
        className="absolute inset-0 w-full h-full -z-50"
      />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
