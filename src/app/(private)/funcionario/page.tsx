"use client";

import FuncionarioPageClient from "@/components/funcionario/FuncionarioPageClient";

export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Funcionarios
      </h1>
      <FuncionarioPageClient />
    </div>
  );
}
