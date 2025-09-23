"use client";

import CategoriaPageClient from "@/components/categoria/CategoriaPageClient";

export default function SetorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">
        Categorias
      </h1>
      <CategoriaPageClient />
    </div>
  );
}
