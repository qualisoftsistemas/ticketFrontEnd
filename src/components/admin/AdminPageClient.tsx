"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Column } from "@/components/table/TableGeneric";
import { Admin } from "@/types/Admin";
import ModalCadastroAdmin from "./CadastroAdmin";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";
import Icon from "../ui/icon";

export default function AdminPageClient() {
  const {
    admins,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdmin,
    loading,
    error,
    pagination,
  } = useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTableData = useCallback(
    (page: number, nome = "") => fetchAdmins({ page, nome }),
    [fetchAdmins]
  );

  useEffect(() => {
    fetchTableData(1);
  }, [fetchTableData]);

  const handleDeleteClick = (id: number) => {
    setDeleteAdminId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteAdminId !== null) {
      await deleteAdmin(deleteAdminId);
      setShowDeleteModal(false);
      setDeleteAdminId(null);
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

  const handleSubmit = async (data: Partial<Admin>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateAdmin(data);
      } else {
        await createAdmin(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditAdmin(null);
    }
  };

  const handleToggleAtivo = (admin: Admin) => {
    const newAtivo = admin.ativo ? 0 : 1;

    useAdminStore.setState((state) => ({
      admins: state.admins.map((s) =>
        s.id === admin.id ? { ...s, ativo: newAtivo } : s
      ),
    }));

    toggleAdmin(admin.id ?? 0).catch(() => {
      useAdminStore.setState((state) => ({
        admins: state.admins.map((s) =>
          s.id === admin.id ? { ...s, ativo: admin.ativo } : s
        ),
      }));
    });
  };

  const handleEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setShowModal(true);
  };

  const columns: Column<Admin>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Admin,
      render: (admin: Admin) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/Icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(admin)}
          />
          <Icon
            icon="/Icons/Trash.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleDeleteClick(admin.id)}
          />
          <Icon
            icon={admin.ativo ? "/Icons/LightOn.svg" : "/Icons/LightOff.svg"}
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleToggleAtivo(admin)}
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
    { icon: "/Icons/Whatsapp.svg", label: "Whatsapp" },
  ];

  if (loading && admins.length === 0)
    return <p className="text-[var(--primary)]">Carregando admins...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={admins}
        showCadastro={() => {
          setEditAdmin(null);
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
        <ModalCadastroAdmin
          isOpen={showModal}
          initialData={editAdmin}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={admins.find((a) => a.id === deleteAdminId)?.nome}
        />
      )}
    </>
  );
}
