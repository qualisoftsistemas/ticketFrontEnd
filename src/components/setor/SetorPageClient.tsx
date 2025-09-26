"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSetorStore } from "@/store/setorStore";
import { Column } from "@/components/table/TableGeneric";
import { Setor } from "@/types/Setor";
import ModalCadastroSetor from "./CadastroSetor";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaTag, FaLightbulb } from "react-icons/fa";
import Table from "../table/Table";

export default function SetorPageClient() {
  const {
    setores,
    fetchSetores,
    createSetor,
    updateSetor,
    deleteSetor,
    loading,
    error,
    pagination,
  } = useSetorStore();

  const [showModal, setShowModal] = useState(false);
  const [editSetor, setEditSetor] = useState<Setor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSetorId, setDeleteSetorId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoriza fetchTableData para não criar nova função a cada render
  const fetchTableData = useCallback(
    (page: number, search?: string) => {
      return fetchSetores({ page, withPagination: true });
    },
    [fetchSetores]
  );

  useEffect(() => {
    fetchTableData(1, ""); // Busca primeira página
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteSetorId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteSetorId !== null) {
      await deleteSetor(deleteSetorId);
      setShowDeleteModal(false);
      setDeleteSetorId(null);
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTableData(page, searchTerm);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    fetchTableData(1, term); // Sempre volta para página 1
  };

  const handleSubmit = async (data: Partial<Setor>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateSetor(data);
      } else {
        await createSetor(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditSetor(null);
    }
  };

  const handleEdit = (setor: Setor) => {
    setEditSetor(setor);
    setShowModal(true);
  };

  const columns: Column<Setor>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Setor,
      render: (setor: Setor) => (
        <div className="flex justify-start gap-4 py-1">
          <img
            src="/Icons/Edit.svg"
            alt="Editar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => handleEdit(setor)}
          />
          <img
            src="/Icons/LightOff.svg"
            alt="Editar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => console.log("Desativou", setor)}
          />
          <img
            src="/Icons/Trash.svg"
            alt="Editar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => handleDeleteClick(setor.id)}
          />
          <img
            src="/Icons/CategoryTag.svg"
            alt="Editar"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105"
            onClick={() => console.log("Tag", setor)}
          />
        </div>
      ),
    },
  ];

  if (loading && setores.length === 0)
    return <p className="text-[var(--primary)]">Carregando setores...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={setores}
        showCadastro={() => {
          setShowModal(true);
          setEditSetor(null);
        }}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {showModal && (
        <ModalCadastroSetor
          isOpen={showModal}
          initialData={editSetor}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setEditSetor(null);
          }}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={setores.find((s) => s.id === deleteSetorId)?.nome}
        />
      )}
    </>
  );
}
