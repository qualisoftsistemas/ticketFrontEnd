"use client";

import React from "react";
import { Chamado } from "@/types/Chamado";
import { Button } from "../ui/button";

interface Props {
  chamado: Chamado | null;
  showRespostaForm?: boolean;
  showRespostaInput?: boolean;
  handleResponder: () => void;
}

const statusColors: Record<string, string> = {
  pendente_pelo_operador: "bg-yellow-200 text-yellow-800",
  pendente_pelo_cliente: "bg-orange-200 text-orange-800",
  concluido: "bg-green-200 text-green-800",
  cancelado: "bg-red-200 text-red-800",
};

const prioridadeColors: Record<string, string> = {
  baixa: "bg-green-100 text-green-800",
  média: "bg-yellow-100 text-yellow-800",
  alta: "bg-red-100 text-red-800",
};

const InfoChamado: React.FC<Props> = ({
  chamado,
  showRespostaForm,
  handleResponder,
  showRespostaInput,
}) => {
  if (!chamado) return null;

  return (
    <div className="bg-[var(--extra)] shadow-md w-full max-w-md mx-auto rounded-lg overflow-hidden">
      <div className="flex bg-[var(--secondary)] p-2 justify-between items-center rounded-t-lg">
        <h3 className="text-lg font-semibold ">{chamado.assunto}</h3>
        <span
          className={`px-2 py-1 text-xs rounded ${
            statusColors[chamado.status] || "bg-gray-200 "
          }`}
        >
          {chamado.status.replace(/_/g, " ")}
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2  ">
          <span
            className={`px-2 py-1 rounded text-xs ${
              prioridadeColors[chamado.prioridade] || "bg-gray-100 "
            }`}
          >
            Prioridade: {chamado.prioridade}
          </span>
          <span className="px-2 py-1 rounded text-xs bg-blue-100  ">
            Criado em: {new Date(chamado.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="space-y-2 mt-2 ">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Solicitante:</span>
            <span>{chamado.solicitante?.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Operador:</span>
            <span>{chamado.operador?.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Empresa:</span>
            <span>{chamado.empresa?.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Setor:</span>
            <span>{chamado.setor?.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Categoria:</span>
            <span>{chamado.categoria?.nome}</span>
          </div>
        </div>
        {showRespostaForm && !showRespostaInput ? (
          <div className="flex justify-center mt-4">
            <Button type="button" onClick={handleResponder} variant={"default"}>
              Responder
            </Button>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <Button type="button" onClick={handleResponder} variant={"default"}>
              Enviar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoChamado;
