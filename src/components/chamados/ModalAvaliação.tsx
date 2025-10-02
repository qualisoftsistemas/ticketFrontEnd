"use client";

import React, { useState } from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";
// Usando o ícone de estrela da lucide-react (pode ser substituído por qualquer ícone SVG)
import { Star } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // A prop onConfirm espera a nota selecionada.
  onConfirm: (nota: number) => void;
  itemName?: string;
  totalStars?: number; // Permite customizar o máximo de estrelas (padrão: 5)
}

export default function ModalAvaliacao({
  isOpen,
  onClose,
  onConfirm,

  totalStars = 5,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleConfirm = () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota antes de confirmar.");
      return;
    }
    onConfirm(rating);
    setRating(0);
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setHover(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">Avalie o Chamado</h2>

        {/* Componente de Star Rating */}
        <div className="flex justify-center gap-1 my-2">
          {[...Array(totalStars)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <Star
                key={index}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  // A estrela é preenchida se o índice for menor ou igual à nota do hover OU à nota do clique
                  currentRating <= (hover || rating)
                    ? "text-yellow-400 fill-yellow-400" // Cor para estrela selecionada/hovered
                    : "text-gray-300" // Cor para estrela não selecionada
                }`}
                onClick={() => setRating(currentRating)}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500">
          Sua avaliação: **{rating}** de {totalStars} estrelas
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <Button variant="default" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={rating === 0}
            className={
              rating > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }
          >
            Confirmar Avaliação
          </Button>
        </div>
      </div>
    </Modal>
  );
}
