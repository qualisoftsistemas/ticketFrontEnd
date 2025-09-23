"use client";
import React, { useState } from "react";
import TableGeneric, { Column } from "./TableGeneric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionBox from "./ActionBox";
import Image from "next/image";
import Pagination from "@/components/ui/pagination";

interface TableProps<T> {
  nomeCadastro?: string;
  columns: Column<T>[];
  data: T[];
  showCadastro?: () => void;
  loading?: boolean;
  pagination: any;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function Table<T extends Record<string, any>>({
  nomeCadastro = "Cadastro",
  columns,
  data,
  showCadastro,
  loading,
  pagination,
  onPageChange,
  searchTerm,
  onSearchChange,
}: TableProps<T>) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-center w-full">
        <div className="flex self-end">
          <ActionBox onToggleFilter={toggleFilters} /> {" "}
        </div>
        <div className="flex gap-2 pb-2">
          <Input
            icon={
              <Image
                src="/Icons/Search.svg"
                alt="Search"
                width={24}
                height={24}
              />
            }
            iconPosition="left"
            placeholder="Buscar..."
            value={searchTerm}
            bgInput="bg-[var(--primary)]"
            bgIcon="bg-[var(--secondary)]"
            textColor="text-[var(--extra)]"
            onChange={(e) => onSearchChange(e.target.value)} // Usa o manipulador de pesquisa do pai
          />
          <Button onClick={showCadastro}>Novo {nomeCadastro}</Button> {" "}
        </div>{" "}
      </div>{" "}
      {showFilters && (
        <div className="w-full p-4 bg-[var(--primary)] rounded shadow-md border border-[var(--extra)]">
          <div className="flex justify-start gap-3 w-full">
            <Button variant="confirm" type="submit" className="px-2 text-xs">
              Aplicar Filtros
            </Button>
            <Button
              variant="destructive"
              type="button"
              className="px-2 text-xs"
            >
              Limpar Tudo
            </Button>
          </div>
        </div>
      )}
      <TableGeneric loading={loading} columns={columns} data={data} />   
      {pagination && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default Table;
