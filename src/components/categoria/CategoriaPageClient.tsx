"use client";

import React, { useEffect, useState } from "react";
import { useCategoriaStore } from "@/store/categoriaStore";
import { Column } from "@/components/table/TableGeneric";
import { Categoria } from "@/types/Categoria";
import ModalCadastroCategoria from "./CadastroCategoria";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
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
  } = useCategoriaStore();

  const [showModal, setShowModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoriaId, setDeleteCategoriaId] = useState<number | null>(
    null
  );

  const handleDeleteClick = (id: number) => {
    setDeleteCategoriaId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteCategoriaId !== null) {
      await deleteCategoria(deleteCategoriaId);
      setShowDeleteModal(false);
      setDeleteCategoriaId(null);
      await fetchCategorias();
    }
  };

  const columns: Column<Categoria>[] = [
    { header: "ID", key: "id" },
    {
      header: "Setor",
      key: "setor",
      render: (categoria: Categoria) => categoria.setor?.nome ?? "-",
    },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Categoria,
      render: (categoria: Categoria) => (
        <div className="flex justify-center gap-2">
          <Button variant="ghost" onClick={() => handleEdit(categoria)}>
            <img
              src="/Icons/Edit.svg"
              alt="Editar"
              className="w-5 h-5 cursor-pointer"
            />
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleDeleteClick(categoria.id)}
          >
            <img
              src="/Icons/Trash.svg"
              alt="Editar"
              className="w-5 h-5 cursor-pointer"
            />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Categoria>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateCategoria(data);
      } else {
        await createCategoria(data);
      }
      await fetchCategorias();
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditCategoria(categoria);
    setShowModal(true);
  };

  if (loading)
    return <p className="text-[var(--primary)]">Carregando categorias...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={categorias}
        showCadastro={() => setShowModal(true)}
        loading={isSubmitting}
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
