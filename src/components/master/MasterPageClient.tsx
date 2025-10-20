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
    toggleMaster,
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
    (page: number, nome = "") => fetchMasters({ page, nome }),
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

  const handleToggleAtivo = (master: Master) => {
    const newAtivo = master.ativo ? 0 : 1;

    useMasterStore.setState((state) => ({
      masters: state.masters.map((s) =>
        s.id === master.id ? { ...s, ativo: newAtivo } : s
      ),
    }));

    toggleMaster(master.id ?? 0).catch(() => {
      useMasterStore.setState((state) => ({
        masters: state.masters.map((s) =>
          s.id === master.id ? { ...s, ativo: master.ativo } : s
        ),
      }));
    });
  };

  const columns: Column<Master>[] = [
    { header: "ID", key: "id" },
    {
      header: "Nome",
      key: "nome",
      render: (master: Master) => (
        <div className="flex items-center gap-2">
          {master.foto && (
            <img
              src={String(master.foto.url)}
              alt={master.nome}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span>{master.nome}</span>
        </div>
      ),
    },
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
            icon="/icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(master)}
          />
          <Icon
            icon={master.ativo ? "/icons/LightOn.svg" : "/icons/LightOff.svg"}
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleToggleAtivo(master)}
          />
        </div>
      ),
    },
  ];

  const legendas = [
    { icon: "/icons/Edit.svg", label: "Editar" },
    { icon: "/icons/LightOff.svg", label: "Ativar (Desativado)" },
    { icon: "/icons/LightOn.svg", label: "Desativar (Ativado)" },
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
        setSearchTerm={setSearchTerm}
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
