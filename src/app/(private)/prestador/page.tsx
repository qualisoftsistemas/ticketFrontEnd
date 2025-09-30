"use client";

import PrestadorPageClient from "@/components/prestador/PrestadorPageClient";
export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Prestadores
      </h1>
      <PrestadorPageClient />
    </div>
  );
}
