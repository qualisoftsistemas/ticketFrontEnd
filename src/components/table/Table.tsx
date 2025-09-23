"use client";
import React, { useState, useMemo } from "react";
import TableGeneric, { Column } from "./TableGeneric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionBox from "./ActionBox";
import Image from "next/image";

interface TableProps<T> {
  nomeCadastro?: string;
  columns: Column<T>[];
  data: T[];
  showCadastro?: () => void;
  loading?: boolean;
}

function Table<T extends Record<string, any>>({
  nomeCadastro = "Cadastro",
  columns,
  data,
  showCadastro,
  loading,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      String(row[Object.keys(row)[1]])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center w-full">
        <div className="flex self-end">
          <ActionBox onToggleFilter={toggleFilters} />
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={showCadastro}>Novo {nomeCadastro}</Button>
        </div>
      </div>

      {showFilters && (
        <div className="w-full p-4 bg-[var(--primary)] rounded shadow-md border border-[var(--extra)]">
          {/* filtros */}
        </div>
      )}

      <TableGeneric loading={loading} columns={columns} data={filteredData} />
    </div>
  );
}

export default Table;
