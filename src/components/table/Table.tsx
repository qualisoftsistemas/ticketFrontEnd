"use client";
import React, { useState } from "react";
import TableGeneric, { Column } from "./TableGeneric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionBox from "./ActionBox";
import Image from "next/image";
import Pagination from "@/components/ui/pagination";
import type { Pagination as PaginationType } from "@/types/Pagination";
import Icon from "../ui/icon";

interface TableProps<T> {
  nomeCadastro?: string;
  columns: Column<T>[];
  data: T[];
  showCadastro?: () => void;
  loading?: boolean;
  pagination: PaginationType | null;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onRowClick?: (id: number) => void;
  onSearchChange: (term: string) => void;
  legendasAcoes?: { icon: string; label: string }[];
}

// eslint-disable-next-line
function Table<T extends Record<string, any>>({
  nomeCadastro = "Cadastro",
  columns,
  data,
  showCadastro,
  loading,
  pagination,
  onPageChange,
  searchTerm,
  onRowClick,
  onSearchChange,
  legendasAcoes
}: TableProps<T>) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full">
        <div className="flex gap-2 flex-wrap">
          <ActionBox onToggleFilter={toggleFilters} />
        </div>

        <div className="flex gap-2  w-full sm:w-auto">
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 min-w-[150px]"
          />
          {showCadastro && (
            <Button onClick={showCadastro} className="whitespace-nowrap">
              Novo {nomeCadastro}
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="w-full p-4 bg-[var(--primary)] rounded border border-[var(--extra)]">
          <div className="flex flex-wrap gap-3">
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

      {/* Tabela Responsiva */}
      <TableGeneric
        onRowClick={onRowClick ? (row) => onRowClick(row.id) : undefined}
        loading={loading}
        columns={columns}
        data={data}
      />

      {legendasAcoes && legendasAcoes.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4 items-center text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)]">
          {legendasAcoes.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image src={item.icon} alt={item.label} width={18} height={18} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      {/* Paginação */}
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
