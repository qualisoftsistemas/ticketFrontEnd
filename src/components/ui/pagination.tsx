"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className="flex gap-2 justify-center py-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "confirm" : "ghost"}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próximo
      </Button>
    </div>
  );
}
