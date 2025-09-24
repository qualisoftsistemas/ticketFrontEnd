"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useFuncionarioStore } from "@/store/funcionarioStore";
import { Column } from "@/components/table/TableGeneric";
import { Funcionario } from "@/types/Funcionario";
import ModalCadastroFuncionario from "./CadastroFuncionario";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";

export default function FuncionarioPageClient() {
  const {
    funcionarios,
    fetchFuncionarios,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
    loading,
    error,
    pagination,
  } = useFuncionarioStore();

  const [showModal, setShowModal] = useState(false);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario | null>(
    null
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFuncionarioId, setDeleteFuncionarioId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, search = "") => fetchFuncionarios({ page, search }),
    [fetchFuncionarios]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteFuncionarioId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteFuncionarioId !== null) {
      await deleteFuncionario(deleteFuncionarioId);
      setShowDeleteModal(false);
      setDeleteFuncionarioId(null);
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

  const handleSubmit = async (data: Partial<Funcionario>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateFuncionario(data);
      } else {
        await createFuncionario(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditFuncionario(null);
    }
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditFuncionario(funcionario);
    setShowModal(true);
  };

  const columns: Column<Funcionario>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Funcionario,
      render: (funcionario: Funcionario) => (
        <div className="flex justify-start gap-4 py-1">
          <img
            src="/Icons/Edit.svg"
            alt="Editar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => handleEdit(funcionario)}
          />
          <img
            src="/Icons/Trash.svg"
            alt="Excluir"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => handleDeleteClick(funcionario.id)}
          />
        </div>
      ),
    },
  ];

  if (loading && funcionarios.length === 0)
    return <p className="text-[var(--primary)]">Carregando funcionários...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={funcionarios}
        showCadastro={() => {
          setEditFuncionario(null);
          setShowModal(true);
        }}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {showModal && (
        <ModalCadastroFuncionario
          isOpen={showModal}
          initialData={editFuncionario}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={
            funcionarios.find((f) => f.id === deleteFuncionarioId)?.nome
          }
        />
      )}
    </>
  );
}
