"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCategoriaStore } from "@/store/categoriaStore";
import { Column } from "@/components/table/TableGeneric";
import { Categoria } from "@/types/Categoria";
import ModalCadastroCategoria from "./CadastroCategoria";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
import Table from "../table/Table";
import Icon from "../ui/icon";

export default function CategoriaPageClient() {
  const {
    categorias,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    toggleCategoria,
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
    (page: number, nome = "") => fetchCategorias({ page, nome }),
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
  const handleToggleAtivo = (categoria: Categoria) => {
    const newAtivo = categoria.ativo ? 0 : 1;

    useCategoriaStore.setState((state) => ({
      categorias: state.categorias.map((s) =>
        s.id === categoria.id ? { ...s, ativo: newAtivo } : s
      ),
    }));

    toggleCategoria(categoria.id ?? 0).catch(() => {
      useCategoriaStore.setState((state) => ({
        categorias: state.categorias.map((s) =>
          s.id === categoria.id ? { ...s, ativo: categoria.ativo } : s
        ),
      }));
    });
  };

  const handleEdit = (categoria: Categoria) => {
    setEditCategoria(categoria);
    setShowModal(true);
  };

  const columns: Column<Categoria>[] = [
    { header: "ID", key: "incremental" },
    { header: "Setor", key: "setor", render: (c) => c.setor?.nome ?? "-" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Categoria,
      render: (categoria: Categoria) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/Icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(categoria)}
          />
          <Icon
            icon="/Icons/Trash.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleDeleteClick(categoria.id)}
          />
          <Icon
            icon={
              categoria.ativo ? "/Icons/LightOn.svg" : "/Icons/LightOff.svg"
            }
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleToggleAtivo(categoria)}
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
  ];

  if (loading && categorias.length === 0)
    return <p className="text-[var(--primary)]">Carregando categorias...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={categorias}
        showCadastro={() => {
          setEditCategoria(null);
          setShowModal(true);
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
