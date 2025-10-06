"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChamadoStore } from "@/store/chamadoStore";

import Table from "../table/Table";
import { Chamado } from "@/types/Chamado";
import { Column } from "../table/TableGeneric";
import { formatDate } from "@/utils/formatDate";
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
  }, []);

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
      render: (chamado) =>
        chamado.created_at
          ? new Date(chamado.created_at).toLocaleDateString("pt-BR")
          : "—",
    },
    {
      header: "Atualizado",
      key: "updated_at",
      render: (chamado) =>
        chamado.updated_at
          ? new Date(chamado.updated_at).toLocaleDateString("pt-BR")
          : "—",
    },
    {
      header: "Status",
      key: "status",
      render: (chamado) => <Badge label={chamado.status} />,
    },
  ];

  return (
    <>
      <FilterBox loading={loading} onFilterChange={handleFilterChange} />
      <Table
        columns={columns}
        data={chamados}
        nomeCadastro="Chamado"
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
