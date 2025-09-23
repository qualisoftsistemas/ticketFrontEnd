"use client";

import SetorPageClient from "@/components/setor/SetorPageClient";

export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">Setores</h1>
      <SetorPageClient />
    </div>
  );
}
