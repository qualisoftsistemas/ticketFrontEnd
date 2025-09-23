"use client";

import React, { useEffect, useState } from "react";
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
  } = useSetorStore();

  const [showModal, setShowModal] = useState(false);
  const [editSetor, setEditSetor] = useState<Setor | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSetorId, setDeleteSetorId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteSetorId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteSetorId !== null) {
      await deleteSetor(deleteSetorId);
      setShowDeleteModal(false);
      setDeleteSetorId(null);
      await fetchSetores();
    }
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

  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  const handleSubmit = async (data: Partial<Setor>) => {
    if (data?.id) {
      await updateSetor(data);
    } else {
      await createSetor(data);
    }
    console.log(data.id);
    setShowModal(false);
    await fetchSetores();
  };

  const handleEdit = (setor: Setor) => {
    setEditSetor(setor);
    setShowModal(true);
  };

  if (loading)
    return <p className="text-[var(--primary)]">Carregando setores...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={setores}
        showCadastro={() => setShowModal(true)}
      />

      {showModal && (
        <ModalCadastroSetor
          isOpen={showModal}
          initialData={editSetor}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
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
