"use client";

import ChamadoPageClient from "@/components/chamados/ChamadoPageClient";

export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Chamados
      </h1>
      <ChamadoPageClient />
    </div>
  );
}
