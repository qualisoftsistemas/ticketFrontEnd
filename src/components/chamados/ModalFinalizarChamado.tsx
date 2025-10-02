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

export default function ModalFinalizarChamado({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal maxWidth="max-w-md" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 ">
        <h2 className="text-lg font-semibold text-center">Finalizar Chamado</h2>
        <p className="text-center">
          Deseja realmente Finalizar o <strong>chamado</strong>?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Finalizar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
