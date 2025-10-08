"use client";

import React, { useState } from "react";
import TableGeneric, { Column } from "./TableGeneric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionBox from "./ActionBox";
import Image from "next/image";
import Pagination from "@/components/ui/pagination";
import type { Pagination as PaginationType } from "@/types/Pagination";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  extractTextFromRender,
  formatCellValue,
} from "@/utils/formatCelulasPraExportar";

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
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onApplyFilters?: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
  renderFilters?: (props: {
    filters: Record<string, any>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    onApply: () => void;
    onClear: () => void;
  }) => React.ReactNode;
  legendasAcoes?: { icon: string; label: string }[];
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
  setSearchTerm,
  onRowClick,
  onSearchChange,
  legendasAcoes,
  renderFilters,
  onApplyFilters,
  onClearFilters,
}: TableProps<T>) {
  // Estado para mostrar/ocultar filtros
  const [showFilters, setShowFilters] = useState(false);

  // Estado para os filtros aplicados
  const [filters, setFilters] = useState<Record<string, any>>({});

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
    console.log(showFilters);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.header);
    const tableRows = data.map((row) =>
      columns.map((col) =>
        col.render
          ? extractTextFromRender(col.render(row))
          : formatCellValue(row[col.key])
      )
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
    });

    doc.save(`${nomeCadastro}.pdf`);
  };

  const handleExportExcel = () => {
    const tableData = data.map((row) => {
      const obj: Record<string, any> = {};
      columns.forEach((col) => {
        obj[col.header] = col.render
          ? extractTextFromRender(col.render(row))
          : formatCellValue(row[col.key]);
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nomeCadastro);

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${nomeCadastro}.xlsx`);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Ações e Busca */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <div className="flex gap-2 flex-wrap self-end">
          <ActionBox
            onToggleFilter={toggleFilters}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>

        <div className="flex gap-2 mb-2 w-full sm:w-auto">
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
            className="flex-1 min-w-[150px]"
          />
          <Button
            className="whitespace-nowrap"
            onClick={() => onSearchChange(searchTerm)}
          >
            Buscar
          </Button>
          {showCadastro && (
            <Button onClick={showCadastro} className="whitespace-nowrap">
              Novo {nomeCadastro}
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      {showFilters && renderFilters && (
        <div className="w-full p-4 bg-[var(--primary)] rounded border border-[var(--extra)]">
          {renderFilters({
            filters,
            setFilters,
            onApply: () => onApplyFilters?.(filters),
            onClear: () => {
              setFilters({});
              onClearFilters?.();
            },
          })}
        </div>
      )}

      {/* Tabela Responsiva */}
      <TableGeneric
        onRowClick={onRowClick ? (row) => onRowClick(row.id) : undefined}
        loading={loading}
        columns={columns}
        data={data}
      />

      {/* Paginação */}
      {pagination && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={onPageChange}
        />
      )}

      {/* Legendas */}
      {legendasAcoes && legendasAcoes.length > 0 && (
        <div className="flex flex-wrap gap-4 items-center text-sm bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded">
          {legendasAcoes.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image src={item.icon} alt={item.label} width={18} height={18} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Table;
