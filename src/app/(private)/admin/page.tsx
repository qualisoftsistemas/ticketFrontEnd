"use client";

import AdminPageClient from "@/components/admin/AdminPageClient";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">Admins</h1>
      <AdminPageClient />
    </div>
  );
}
