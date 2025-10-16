"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useOperadorStore } from "@/store/operadorStore";
import { Column } from "@/components/table/TableGeneric";
import { Operador } from "@/types/Operador";
import ModalCadastroOperador from "./CadastroOperador";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";
import TableSelectSetores from "../ui/tableSelect";
import apiFetchClient from "@/service/api";
import Icon from "../ui/icon";

export default function OperadorPageClient() {
  const {
    operadores,
    fetchOperadores,
    createOperador,
    updateOperador,
    deleteOperador,
    toggleOperador,
    loading,
    error,
    pagination,
  } = useOperadorStore();

  const [showModal, setShowModal] = useState(false);
  const [editOperador, setEditOperador] = useState<Operador | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOperadorId, setDeleteOperadorId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showTableSetores, setShowTableSetores] = useState(false);

  const fetchTableData = useCallback(
    (page: number, nome = "") => fetchOperadores({ page, nome }),
    [fetchOperadores]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteOperadorId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteOperadorId !== null) {
      await deleteOperador(deleteOperadorId);
      setShowDeleteModal(false);
      setDeleteOperadorId(null);
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTableData(page, searchTerm);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    fetchTableData(1, term);
  };

  const handleSubmit = async (data: Partial<Operador>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateOperador(data);
      } else {
        await createOperador(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditOperador(null);
    }
  };

  const handleEdit = (operador: Operador) => {
    setEditOperador(operador);
    setShowModal(true);
  };

  const handleSelectSetores = (operador: Operador) => {
    setEditOperador(operador);
    setShowTableSetores(true);
  };

  const handleSetSetores = async (setores: number[]) => {
    if (!editOperador) return;

    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/atribuir_setores`,
        data: {
          operador_id: editOperador.id,
          setores: setores,
        },
      });

      await fetchTableData(pagination?.current_page || 1, searchTerm);
      setShowTableSetores(false);
    } catch (error) {
      console.error("Erro ao atribuir setores:", error);
    }
  };

  const handleToggleAtivo = (operador: Operador) => {
    const newAtivo = operador.ativo ? 0 : 1;

    useOperadorStore.setState((state) => ({
      operadores: state.operadores.map((s) =>
        s.id === operador.id ? { ...s, ativo: newAtivo } : s
      ),
    }));

    toggleOperador(operador.id ?? 0).catch(() => {
      useOperadorStore.setState((state) => ({
        operadores: state.operadores.map((s) =>
          s.id === operador.id ? { ...s, ativo: operador.ativo } : s
        ),
      }));
    });
  };

  const columns: Column<Operador>[] = [
    { header: "ID", key: "id" },
    {
      header: "Nome",
      key: "nome",
      render: (operador: Operador) => (
        <div className="flex items-center gap-2">
          {operador.foto && (
            <img
              src={String(operador.foto.url)}
              alt={operador.nome}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span>{operador.nome}</span>
        </div>
      ),
    },
    {
      header: "Ações",
      key: "actions" as keyof Operador,
      render: (operador: Operador) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/Icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(operador)}
          />
          <Icon
            icon="/Icons/Trash.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleDeleteClick(operador.id)}
          />
          <Icon
            icon="/Icons/SectorTree.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleSelectSetores(operador)}
          />
          <Icon
            icon={operador.ativo ? "/Icons/LightOn.svg" : "/Icons/LightOff.svg"}
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleToggleAtivo(operador)}
          />
        </div>
      ),
    },
  ];

  const legendas = [
    { icon: "/Icons/Edit.svg", label: "Editar" },
    { icon: "/Icons/LightOff.svg", label: "Ativar (Desativado)" },
    { icon: "/Icons/LightOn.svg", label: "Desativar (Ativado)" },
    { icon: "/Icons/Trash.svg", label: "Excluir" },
    { icon: "/Icons/SectorTree.svg", label: "Atribuir Setores" },
  ];

  if (loading && operadores.length === 0)
    return <p className="text-[var(--primary)]">Carregando operadores...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={operadores}
        showCadastro={() => {
          setShowModal(true);
          setEditOperador(null);
        }}
        setSearchTerm={setSearchTerm}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        legendasAcoes={legendas}
      />

      {showModal && (
        <ModalCadastroOperador
          isOpen={showModal}
          initialData={editOperador}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={operadores.find((o) => o.id === deleteOperadorId)?.nome}
        />
      )}

      {showTableSetores && (
        <TableSelectSetores
          title="Atribuir Setores ao Operador"
          prestadorId={editOperador?.id || 0}
          isOpen={showTableSetores}
          onClose={() => setShowTableSetores(false)}
          onConfirm={(setores) => handleSetSetores(setores)}
        />
      )}
    </>
  );
}
