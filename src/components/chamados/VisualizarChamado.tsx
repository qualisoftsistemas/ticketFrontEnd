import { Chamado, ChamadoApiResponse } from "@/types/Chamado";
import DescriptionBox from "../ui/descriptionBox";
import React from "react";
import Badge from "../ui/badge";
import Mensagem from "./Mensagem";

export interface VisualizarChamadoProps {
  chamado: ChamadoApiResponse | null;
}

const VisualizarChamado = ({ chamado }: VisualizarChamadoProps) => {
  if (!chamado) return null;
  const chamadoSelecionado = chamado?.chamado;

  console.log("Chamado selecionado:", chamadoSelecionado);

  return (
    <div className="bg-[var(--primary)] p-6 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex    items-center gap-4">
          <h2 className="text-2xl font-semibold   text-[var(--extra)]">
            Visualizar Chamado
          </h2>
          <span>
            <Badge label={`Nº ${chamadoSelecionado?.id ?? ""}`} />
          </span>
        </div>
        <Badge label={chamadoSelecionado?.status ?? ""} />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DescriptionBox
            type={"Solicitante"}
            label={chamadoSelecionado?.solicitante?.nome ?? ""}
          />
          <DescriptionBox
            type="Empresa"
            label={chamadoSelecionado?.empresa?.nome ?? ""}
          />
          <DescriptionBox
            type="Setor"
            label={chamadoSelecionado?.setor?.nome ?? ""}
          />
          <DescriptionBox
            type="Categoria"
            label={chamadoSelecionado?.categoria?.nome ?? ""}
          />
          <DescriptionBox
            type="Operador"
            label={chamadoSelecionado?.operador?.nome ?? ""}
          />
        </div>
        <DescriptionBox
          type="Assunto"
          label={chamadoSelecionado?.assunto ?? ""}
        />
      </div>
      <div className="space-y-4 mt-6 ">
        {chamadoSelecionado?.mensagens.map((msg, index) => (
          <Mensagem key={msg.id} mensagem={msg} numero={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default VisualizarChamado;
