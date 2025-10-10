"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
  const handleReturnLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("empresa-store");
    window.location.href = "/";
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--primary)] text-[var(--extra)] px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6 text-center">
        Ops! A página que você está procurando não foi encontrada.
      </p>
      <Button
        onClick={handleReturnLogin}
        className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-6 py-3 rounded-md hover:opacity-90 transition"
      >
        Voltar para Login
      </Button>
    </div>
  );
};

export default NotFoundPage;
