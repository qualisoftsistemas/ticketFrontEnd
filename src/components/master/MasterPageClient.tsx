"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useMasterStore } from "@/store/masterStore";
import { Column } from "@/components/table/TableGeneric";
import { Master } from "@/types/Master";
import ModalCadastroMaster from "./CadastroMaster";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";
import Icon from "../ui/icon";

export default function MasterPageClient() {
  const {
    masters,
    fetchMasters,
    createMaster,
    updateMaster,
    deleteMaster,
    loading,
    error,
    pagination,
  } = useMasterStore();

  const [showModal, setShowModal] = useState(false);
  const [editMaster, setEditMaster] = useState<Master | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMasterId, setDeleteMasterId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, search = "") => fetchMasters({ page, search }),
    [fetchMasters]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleConfirmDelete = async () => {
    if (deleteMasterId !== null) {
      await deleteMaster(deleteMasterId);
      setShowDeleteModal(false);
      setDeleteMasterId(null);
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

  const handleSubmit = async (data: Partial<Master>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateMaster(data);
      } else {
        await createMaster(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditMaster(null);
    }
  };

  const handleEdit = (master: Master) => {
    setEditMaster(master);
    setShowModal(true);
  };

  const columns: Column<Master>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Prestador",
      key: "prestador_id",
      render: (master) => master?.prestador?.nome,
    },
    {
      header: "Ações",
      key: "actions" as keyof Master,
      render: (master: Master) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/Icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(master)}
          />
        </div>
      ),
    },
  ];

  const legendas = [
    { icon: "/Icons/Edit.svg", label: "Editar" },
    { icon: "/Icons/LightOff.svg", label: "Ativar (Desativado)" },
    { icon: "/Icons/LightOn.svg", label: "Desativar (Ativado)" },
  ];

  if (loading && masters.length === 0)
    return <p className="text-[var(--primary)]">Carregando masters...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={masters}
        showCadastro={() => {
          setEditMaster(null);
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
        <ModalCadastroMaster
          isOpen={showModal}
          initialData={editMaster}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={masters.find((m) => m.id === deleteMasterId)?.nome}
        />
      )}
    </>
  );
}
