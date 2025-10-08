"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useEmpresaStore } from "@/store/empresaStore";
import { Column } from "@/components/table/TableGeneric";
import { Empresa } from "@/types/Empresa";
import ModalCadastroEmpresa from "./CadastroEmpresa";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
import Table from "../table/Table";
import Icon from "../ui/icon";

export default function EmpresaPageClient() {
  const {
    empresas,
    fetchEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    loading,
    error,
    pagination,
  } = useEmpresaStore();

  const [showModal, setShowModal] = useState(false);
  const [editEmpresa, setEditEmpresa] = useState<Empresa | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmpresaId, setDeleteEmpresaId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, search = "") => fetchEmpresas({ page, search }),
    [fetchEmpresas]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteEmpresaId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteEmpresaId !== null) {
      await deleteEmpresa(deleteEmpresaId);
      setShowDeleteModal(false);
      setDeleteEmpresaId(null);
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

  const handleSubmit = async (data: Partial<Empresa>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateEmpresa(data);
      } else {
        await createEmpresa(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditEmpresa(null);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setEditEmpresa(empresa);
    setShowModal(true);
  };

  const columns: Column<Empresa>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Empresa,
      render: (empresa: Empresa) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/Icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(empresa)}
          />
          <Icon
            icon="/Icons/Trash.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleDeleteClick(empresa.id)}
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

  if (loading && empresas.length === 0)
    return <p className="text-[var(--primary)]">Carregando empresas...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={empresas}
        showCadastro={() => {
          setShowModal(true);
          setEditEmpresa(null);
        }}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        legendasAcoes={legendas}
      />

      {showModal && (
        <ModalCadastroEmpresa
          isOpen={showModal}
          initialData={editEmpresa}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={empresas.find((e) => e.id === deleteEmpresaId)?.nome}
        />
      )}
    </>
  );
}
