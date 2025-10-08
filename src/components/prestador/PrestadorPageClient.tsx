"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePrestadorStore } from "@/store/prestadorStore";
import { Column } from "@/components/table/TableGeneric";
import { Prestador } from "@/types/Prestador";
import ModalCadastroPrestador from "./CadastroPrestador";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";
import Icon from "../ui/icon";

export default function PrestadorPageClient() {
  const {
    prestadores,
    fetchPrestadores,
    createPrestador,
    updatePrestador,
    deletePrestador,
    loading,
    error,
    pagination,
  } = usePrestadorStore();

  const [showModal, setShowModal] = useState(false);
  const [editPrestador, setEditPrestador] = useState<Prestador | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePrestadorId, setDeletePrestadorId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, search = "") => fetchPrestadores({ page, search }),
    [fetchPrestadores]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleConfirmDelete = async () => {
    if (deletePrestadorId !== null) {
      await deletePrestador(deletePrestadorId);
      setShowDeleteModal(false);
      setDeletePrestadorId(null);
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

  const handleSubmit = async (data: Partial<Prestador>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updatePrestador(data);
      } else {
        await createPrestador(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditPrestador(null);
    }
  };

  const handleEdit = (prestador: Prestador) => {
    setEditPrestador(prestador);
    setShowModal(true);
  };

  const columns: Column<Prestador>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Prestador,
      render: (prestador: Prestador) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/Icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(prestador)}
          />
        </div>
      ),
    },
  ];

  const legendas = [
    { icon: "/Icons/Edit.svg", label: "Editar" },
  ];

  if (loading && prestadores.length === 0)
    return <p className="text-[var(--primary)]">Carregando prestadores...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={prestadores}
        showCadastro={() => {
          setEditPrestador(null);
          setShowModal(true);
        }}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        legendasAcoes={legendas}
      />

      {showModal && (
        <ModalCadastroPrestador
          isOpen={showModal}
          initialData={editPrestador}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={prestadores.find((p) => p.id === deletePrestadorId)?.nome}
        />
      )}
    </>
  );
}
