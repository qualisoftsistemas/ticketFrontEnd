"use client";

import React from "react";
import { Chamado } from "@/types/Chamado";
import { Button } from "../ui/button";

interface Props {
  chamado: Chamado | null;
  showRespostaForm?: boolean;
  showRespostaInput?: boolean;
  handleResponder: () => void;
  role: string;
  handleFinalizar: () => void;
}

export const statusColors: Record<string, string> = {
  pendente_pelo_operador: "bg-yellow-200 text-yellow-800",
  pendente_pelo_cliente: "bg-orange-200 text-orange-800",
  concluido: "bg-green-200 text-green-800",
  cancelado: "bg-red-200 text-red-800",
};

export const prioridadeColors: Record<string, string> = {
  baixa: "bg-green-100 text-green-800",
  média: "bg-yellow-100 text-yellow-800",
  alta: "bg-red-100 text-red-800",
};

const InfoChamado: React.FC<Props> = ({
  chamado,
  showRespostaForm,
  handleResponder,
  showRespostaInput,
  role,
  handleFinalizar,
}) => {
  if (!chamado) return null;

  return (
    <div className="bg-[var(--extra)] shadow-md w-full max-w-md mx-auto rounded-lg overflow-hidden">
      <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] p-1 text-lg text-center rounded-t-lg">
        <h1>{chamado.solicitante?.nome}</h1>
      </div>
      <div className="p-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-[var(--primary)] rounded">
            <span className="bg-[var(--secondary)] p-1 rounded-l">
              <img src="/Icons/Whatsapp.svg" alt="Icone de Email" />
            </span>
            <p className="p-1">{chamado.operador?.whatsapp}</p>
          </div>
          <div className="flex items-center bg-[var(--primary)] rounded">
            <span className="bg-[var(--secondary)] p-1 rounded-l">
              <img src="/Icons/Mail.svg" alt="Icone de Email" />
            </span>
            <p className="p-1">{chamado.operador?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {showRespostaForm && !showRespostaInput && (
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={handleResponder}
                variant={"default"}
              >
                Responder
              </Button>
            </div>
          )}

          {showRespostaForm && !showRespostaInput && role === "Operador" && (
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={handleFinalizar}
                variant={"default"}
              >
                Finalizar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoChamado;
