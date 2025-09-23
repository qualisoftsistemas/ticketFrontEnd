"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCategoriaStore } from "@/store/categoriaStore";
import { Column } from "@/components/table/TableGeneric";
import { Categoria } from "@/types/Categoria";
import ModalCadastroCategoria from "./CadastroCategoria";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../table/Table";

export default function CategoriaPageClient() {
  const {
    categorias,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    loading,
    error,
    pagination,
  } = useCategoriaStore();

  const [showModal, setShowModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoriaId, setDeleteCategoriaId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, search = "") => fetchCategorias({ page, search }),
    [fetchCategorias]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteCategoriaId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteCategoriaId !== null) {
      await deleteCategoria(deleteCategoriaId);
      setShowDeleteModal(false);
      setDeleteCategoriaId(null);
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

  const handleSubmit = async (data: Partial<Categoria>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateCategoria(data);
      } else {
        await createCategoria(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditCategoria(null);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditCategoria(categoria);
    setShowModal(true);
  };

  const columns: Column<Categoria>[] = [
    { header: "ID", key: "id" },
    { header: "Setor", key: "setor", render: (c) => c.setor?.nome ?? "-" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Categoria,
      render: (categoria: Categoria) => (
        <div className="flex justify-center gap-2">
          <Button variant="ghost" onClick={() => handleEdit(categoria)}>
            <FaEdit />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleDeleteClick(categoria.id)}
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && categorias.length === 0)
    return <p className="text-[var(--primary)]">Carregando categorias...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={categorias}
        showCadastro={() => setShowModal(true)}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {showModal && (
        <ModalCadastroCategoria
          isOpen={showModal}
          initialData={editCategoria}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={categorias.find((c) => c.id === deleteCategoriaId)?.nome}
        />
      )}
    </>
  );
}
