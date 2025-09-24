"use client";

import ConglomeradoPageClient from "@/components/conglomerado/ConglomeradoPageClient";

export default function ConglomeradoPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Conglomerados
      </h1>
      <ConglomeradoPageClient />
    </div>
  );
}
