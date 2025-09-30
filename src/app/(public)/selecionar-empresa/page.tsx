import SelectEmpresa from "@/components/login/SelectEmpresa";
import React from "react";

const LoginPage = () => {
  return (
    <div className="relative flex items-center justify-center h-screen p-2">
      <img
        src="Images/landing_page.webp"
        alt="Imagem de Fundo"
        className="absolute inset-0 w-full h-full -z-50"
      />
      <SelectEmpresa />
    </div>
  );
};

export default LoginPage;
