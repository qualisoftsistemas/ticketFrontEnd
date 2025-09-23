"use client";

import React, { useEffect, useState } from "react";
import { useCategoriaStore } from "@/store/categoriaStore";
import TableGeneric, { Column } from "@/components/table/TableGeneric";
import { Categoria } from "@/types/Categoria";
import ModalCadastroCategoria from "./CadastroCategoria";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash } from "react-icons/fa";

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
    { header: "Setor ID", key: "setor_id" },
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

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleSubmit = async (data: Partial<Categoria>) => {
    if (data?.id) {
      await updateCategoria(data);
    } else {
      await createCategoria(data);
    }
    setShowModal(false);
    await fetchCategorias();
  };

  const handleEdit = (categoria: Categoria) => {
    setEditCategoria(categoria);
    setShowModal(true);
  };

  if (loading) return <p>Carregando categorias...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <TableGeneric columns={columns} data={categorias} />

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
