import SelectEmpresa from "@/components/login/SelectEmpresa";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen p-2 bg-[var(--neutral)]">
      <SelectEmpresa/>
    </div>
  );
};

export default LoginPage;
