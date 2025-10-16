"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChamadoStore } from "@/store/chamadoStore";

import Table from "../table/Table";
import { Chamado } from "@/types/Chamado";
import { Column } from "../table/TableGeneric";
import Badge from "../ui/badge";
import FilterBox from "./FilterBox";
import { Button } from "../ui/button";
import Select, { SelectOption } from "../ui/select";

import { SelectsData } from "./CadastroChamado";
import apiFetchClient from "@/service/api";
import Icon from "../ui/icon";

export default function ChamadoPageClient() {
  const router = useRouter();

  const { chamados, loading, fetchChamados, pagination, statusQtde } =
    useChamadoStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([
    "pendente_pelo_operador",
    "pendente_pelo_usuario",
    "aguardando_avaliacao",
  ]);

  const [selectedSetor, setSelectedSetor] = useState<SelectOption[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<SelectOption[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<SelectOption[]>(
    []
  );
  const [selectedOperador, setSelectedOperador] = useState<SelectOption[]>([]);

  const [empresas, setEmpresas] = useState<SelectsData["empresas"]>([]);
  const [setores, setSetores] = useState<SelectsData["setores"]>([]);
  const [categorias, setCategorias] = useState<SelectsData["categorias"]>([]);
  const [operadores, setOperadores] = useState<SelectsData["operadores"]>([]);

  const handleStatusChange = (status: string[]) => {
    setSelectedStatus(status);
    fetchTableData(1, searchTerm, status);
  };

  const fetchTableData = useCallback(
    (page: number, assunto = "", status: string[] = selectedStatus) =>
      fetchChamados({ page, assunto, status }),
    [fetchChamados, selectedStatus]
  );

  const handlePageChange = (page: number) => {
    fetchTableData(page, searchTerm);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    fetchTableData(1, term);
  };

  const handleVerChamado = (chamado: Chamado) => {
    router.push(`/chamados/${chamado.id}`);
  };
  const showCadastro = () => {
    router.push("/chamados/cadastro");
  };

  useEffect(() => {
    const fetchSelectsData = async () => {
      try {
        const data = await apiFetchClient<SelectsData>({
          method: "GET",
          endpoint: "/abrir_chamado/selects_iniciais",
        });

        setEmpresas(data.empresas || []);
        setSetores(data.setores || []);
      } catch (err) {
        console.error("Erro ao buscar selects:", err);
      }
    };

    fetchSelectsData();
  }, []);

  const empresasOptions: SelectOption[] = empresas.map((s) => ({
    id: s.id,
    label: s.nome,
  }));
  const setorOptions: SelectOption[] = setores.map((s) => ({
    id: s.id,
    label: s.nome,
  }));
  const categoriaOptions: SelectOption[] = categorias.map((s) => ({
    id: s.id,
    label: s.nome,
  }));
  const operadorOptions: SelectOption[] = operadores.map((s) => ({
    id: s.id,
    label: s.nome,
  }));

  const columns: Column<Chamado>[] = [
    {
      header: "Cód",
      key: "id",
      render: (chamado) => (
        <div   className="flex items-center gap-2">
          <Icon icon="/Icons/Eye.svg" className="w-5 h-5 bg-white" />
          <span>{chamado.id}</span>
        </div>
      ),
    },
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
      render: (chamado) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          pendente_pelo_operador: {
            label: "Pendente Operador",
            color: "bg-yellow-200 text-yellow-800",
          },
          pendente_pelo_usuario: {
            label: "Pendente Usuário",
            color: "bg-blue-200 text-blue-800",
          },
          aguardando_avaliacao: {
            label: "Aguardando Avaliação",
            color: "bg-orange-200 text-orange-800",
          },
          concluido: {
            label: "Concluído",
            color: "bg-green-200 text-green-800",
          },
        };

        const statusInfo = statusMap[chamado.status] || {
          label: chamado.status,
          color: "blue",
        };

        return <Badge label={statusInfo.label} bgColor={statusInfo.color} />;
      },
    },
  ];

  return (
    <>
      <FilterBox
        loading={loading}
        statusQtde={statusQtde}
        onFilterChange={handleStatusChange}
      />

      <Table
        columns={columns}
        data={chamados}
        nomeCadastro="Chamado"
        showCadastro={showCadastro}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchChange={handleSearchChange}
        onRowClick={handleVerChamado}
        onApplyFilters={() => {
          fetchChamados({
            page: 1,
            search: searchTerm,
            setor_id:
              selectedSetor[0]?.id !== undefined
                ? Number(selectedSetor[0].id)
                : null,
            operador_id:
              selectedOperador[0]?.id !== undefined
                ? Number(selectedOperador[0].id)
                : null,
            categoria_id:
              selectedCategoria[0]?.id !== undefined
                ? Number(selectedCategoria[0].id)
                : null,
            empresa_id:
              selectedEmpresa[0]?.id !== undefined
                ? Number(selectedEmpresa[0].id)
                : null,
          });
        }}
        onClearFilters={() => {
          setSelectedSetor([]);
          setSelectedOperador([]);
          setSelectedCategoria([]);
          setSelectedEmpresa([]);
          setSearchTerm("");

          fetchChamados({
            page: 1,
            search: "",
            status: [
              "pendente_pelo_operador",
              "pendente_pelo_usuario",
              "aguardando_avaliacao",
            ],
            setor_id: null,
            operador_id: null,
            categoria_id: null,
            empresa_id: null,
          });
        }}
        renderFilters={({ onApply, onClear }) => (
          <div className="flex flex-col gap-4 w-full">
            {/* Linha 1: Empresa + Setor */}
            <div className="flex w-full gap-2 flex-wrap">
              <div className="flex-1">
                <Select
                  label="Empresa"
                  options={empresasOptions}
                  placeholder="Selecione a empresa"
                  selectedOption={selectedEmpresa[0] || null}
                  onSelect={(option) => setSelectedEmpresa([option])}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Setor"
                  options={setorOptions}
                  placeholder="Selecione o setor"
                  selectedOption={selectedSetor[0] || null}
                  onSelect={async (option) => {
                    const setorId = Number(option.id);
                    setSelectedSetor([option]);

                    setCategorias([]);
                    setOperadores([]);
                    setSelectedCategoria([]);
                    setSelectedOperador([]);

                    try {
                      const data = await apiFetchClient<{
                        categorias: { id: number; nome: string }[];
                        operadores: {
                          id: number;
                          nome: string;
                          foto?: string | null;
                        }[];
                      }>({
                        method: "GET",
                        endpoint: `/abrir_chamado/detalhes_setor/${setorId}`,
                      });

                      setCategorias(data.categorias || []);
                      setOperadores(data.operadores || []);
                    } catch (err) {
                      console.error("Erro ao buscar detalhes do setor:", err);
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Operador"
                  options={operadorOptions}
                  placeholder="Selecione o operador"
                  disabled={operadores.length === 0}
                  selectedOption={selectedOperador[0] || null}
                  onSelect={(option) => setSelectedOperador([option])}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Categoria"
                  options={categoriaOptions}
                  placeholder="Selecione a categoria"
                  disabled={categorias.length === 0}
                  selectedOption={selectedCategoria[0] || null}
                  onSelect={(option) => setSelectedCategoria([option])}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <Button onClick={onApply}>Aplicar Filtros</Button>
              <Button onClick={onClear}>Limpar Tudo</Button>
            </div>
          </div>
        )}
      />
    </>
  );
}
