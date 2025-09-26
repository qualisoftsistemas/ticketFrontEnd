"use client";

import EmpresaPageClient from "@/components/empresa/EmpresaPageClient";

export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Empresas
      </h1>
      <EmpresaPageClient />
    </div>
  );
}
