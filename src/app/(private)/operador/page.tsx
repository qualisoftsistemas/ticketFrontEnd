"use client";

import OperadorPageClient from "@/components/operador/OperadorPageClient";

export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Operadores
      </h1>
      <OperadorPageClient />
    </div>
  );
}
