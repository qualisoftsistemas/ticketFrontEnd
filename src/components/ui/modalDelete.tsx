// ModalDeletar.tsx
"use client";

import React from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function ModalDeletar({
  isOpen,
  onClose,
  onConfirm,
  itemName = "item",
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">
          Confirmar exclusão
        </h2>
        <p className="text-center">
          Deseja realmente deletar <strong>{itemName}</strong>?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Deletar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
