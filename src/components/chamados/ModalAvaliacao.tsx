"use client";

import React, { useState } from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";
import StarRating from "../ui/stars";
import { Chamado } from "@/types/Chamado";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nota: number, comentario: string) => void;
  chamado: Chamado;
  totalStars?: number;
}

export default function ModalAvaliacao({
  isOpen,
  onClose,
   onConfirm,
  totalStars = 5,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const legends: Record<number, string> = {
    1: "Péssimo",
    2: "Ruim",
    3: "Regular",
    4: "Bom",
    5: "Excelente",
  };

  const handleClose = () => {
    setRating(0);
    setComentario("");
    setShowCelebration(false);
    onClose();
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota antes de confirmar.");
      return;
    }

    try {
      onConfirm(rating, comentario);
    } catch (error) {
      console.error("Erro ao confirmar avaliação:", error);
    }

    if (rating === 5) {
      setShowCelebration(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } else {
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-2 items-center justify-center">
        {!showCelebration ? (
          <>
            <h2 className="text-lg font-semibold text-center">
              Avalie o Chamado
            </h2>

            <StarRating totalStars={totalStars} onChange={setRating} />

            {rating > 0 && (
              <p className="text-center text-[var(--primary-foreground)]">
                {legends[rating]} ({rating}{" "}
                {rating === 1 ? "estrela" : "estrelas"})
              </p>
            )}

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Deixe seu comentário (opcional)"
              className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="confirm"
                onClick={handleSubmit}
                disabled={rating === 0}
              >
                Avaliar
              </Button>
              <Button variant="destructive" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <video
              src="/Videos/FiveStars.webm"
              autoPlay
              muted
              className="w-24 h-24"
            />
            <p className="text-center text-[var(--primary-foreground)]">
              Excelente! Agradecemos pela avaliação
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
