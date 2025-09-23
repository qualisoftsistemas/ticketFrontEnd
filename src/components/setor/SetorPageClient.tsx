"use client";

import React, { useEffect, useState } from "react";
import { useSetorStore } from "@/store/setorStore";
import TableGeneric, { Column } from "@/components/table/TableGeneric";
import { Setor } from "@/types/Setor";
import ModalCadastroSetor from "./CadastroSetor";
import ModalDeletar from "@/components/ui/modalDelete";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaTag, FaLightbulb } from "react-icons/fa";

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
        <div className="flex justify-center gap-2">
          <Button variant="ghost" onClick={() => handleEdit(setor)}>
            <FaEdit />
          </Button>
          <Button variant="ghost" onClick={() => handleDeleteClick(setor.id)}>
            <FaTrash />
          </Button>
          <Button variant="ghost" onClick={() => console.log("Tag", setor)}>
            <FaTag />
          </Button>
          <Button variant="ghost" onClick={() => console.log("Bulb", setor)}>
            <FaLightbulb />
          </Button>
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

  if (loading) return <p>Carregando setores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <TableGeneric columns={columns} data={setores} />

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
