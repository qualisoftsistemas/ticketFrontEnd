"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChamadoStore } from "@/store/chamadoStore";

import Table from "../table/Table";
import { Chamado } from "@/types/Chamado";
import { Column } from "../table/TableGeneric";
import { formatDate } from "@/app/utils/formatDate";
import Badge from "../ui/badge";
import FilterBox from "./FilterBox";

export default function ChamadoPageClient() {
  const router = useRouter();

  const { chamados, loading, fetchChamados, pagination } = useChamadoStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([
    "pendente_pelo_operador",
    "pendente_pelo_usuario",
    "aguardando_avaliacao",
  ]);

  const handleFilterChange = (status: string[]) => {
    setSelectedStatus(status);
    fetchTableData(1, searchTerm, status);
  };

  const fetchTableData = useCallback(
    (page: number, search = "", status: string[] = selectedStatus) =>
      fetchChamados({ page, search, status }),
    [fetchChamados, selectedStatus]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handlePageChange = (page: number) => {
    fetchTableData(page, searchTerm);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    fetchTableData(1, term);
  };

  const handleVerChamado = (id: number) => {
    router.push(`/chamados/${id}`);
  };

  const showCadastro = () => {
    router.push("/chamados/cadastro");
  };

  const columns: Column<Chamado>[] = [
    { header: "Cód", key: "id" },
    { header: "Assunto", key: "assunto" },
    {
      header: "Empresa",
      key: "empresa",
      render: (chamado) => chamado.empresa?.nome || "—",
    },
    {
      header: "Operador",
      key: "operador",
      render: (chamado) => chamado.operador?.nome || "—",
    },
    {
      header: "Aberto",
      key: "created_at",
      render: (chamado) => formatDate(chamado.created_at),
    },
    {
      header: "Atualizado",
      key: "updated_at",
      render: (chamado) => formatDate(chamado.updated_at),
    },
    {
      header: "Status",
      key: "status",
      render: (chamado) => <Badge label={chamado.status} />,
    },
  ];

  return (
    <>
      <FilterBox onFilterChange={handleFilterChange} />
      <Table
        columns={columns}
        data={chamados}  
        showCadastro={showCadastro}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onRowClick={handleVerChamado}
      />
    </>
  );
}
