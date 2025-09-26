"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useConglomeradoStore } from "@/store/conglomeradoStore";
import { Column } from "@/components/table/TableGeneric";
import { Conglomerado } from "@/types/Conglomerado";
import ModalCadastroConglomerado from "./CadastroConglomerado";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";

export default function ConglomeradoPageClient() {
  const {
    conglomerados,
    fetchConglomerados,
    createConglomerado,
    updateConglomerado,
    deleteConglomerado,
    loading,
    error,
    pagination,
  } = useConglomeradoStore();

  const [showModal, setShowModal] = useState(false);
  const [editConglomerado, setEditConglomerado] = useState<Conglomerado | null>(
    null
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConglomeradoId, setDeleteConglomeradoId] = useState<
    number | null
  >(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, search = "") => fetchConglomerados({ page, search }),
    [fetchConglomerados]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteConglomeradoId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteConglomeradoId !== null) {
      await deleteConglomerado(deleteConglomeradoId);
      setShowDeleteModal(false);
      setDeleteConglomeradoId(null);
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

  const handleSubmit = async (data: Partial<Conglomerado>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateConglomerado(data);
      } else {
        await createConglomerado(data);
      }
      console.log(data);
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditConglomerado(null);
    }
  };

  const handleEdit = (conglomerado: Conglomerado) => {
    setEditConglomerado(conglomerado);
    setShowModal(true);
  };

  const columns: Column<Conglomerado>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Conglomerado,
      render: (conglomerado: Conglomerado) => (
        <div className="flex justify-start gap-4 py-1">
          <img
            src="/Icons/Edit.svg"
            alt="Editar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => handleEdit(conglomerado)}
          />
          <img
            src="/Icons/Trash.svg"
            alt="Deletar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => handleDeleteClick(conglomerado.id)}
          />
        </div>
      ),
    },
  ];

  if (loading && conglomerados.length === 0)
    return <p className="text-[var(--primary)]">Carregando conglomerados...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={conglomerados}
        showCadastro={() => {
          setEditConglomerado(null);
          setShowModal(true);
        }}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {showModal && (
        <ModalCadastroConglomerado
          isOpen={showModal}
          initialData={editConglomerado}
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
            conglomerados.find((c) => c.id === deleteConglomeradoId)?.nome
          }
        />
      )}
    </>
  );
}
