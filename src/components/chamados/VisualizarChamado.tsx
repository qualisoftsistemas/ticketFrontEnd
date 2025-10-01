'use client";';
import { useEffect, useState } from "react";
import { ChamadoApiResponse } from "@/types/Chamado";
import DescriptionBox from "../ui/descriptionBox";
import React from "react";
import Badge from "../ui/badge";
import Mensagem from "./Mensagem";
import InfoChamado from "./InfoChamado";
import { useUserRole } from "@/hooks/useUserRole";
import RespostaChamado from "./RespostaChamado";
import apiFetchClient from "@/service/api";
import type { RespostaFormData } from "./RespostaChamado";
import { UploadedFile } from "../ui/inputFile";
import { MensagemType } from "./Mensagem";

export interface VisualizarChamadoProps {
  chamado: ChamadoApiResponse | null;
}

const VisualizarChamado = ({ chamado }: VisualizarChamadoProps) => {
  if (!chamado) return null;
  const chamadoSelecionado = chamado.chamado;

  const role = useUserRole();
  const [showRespostaForm, setShowRespostaForm] = useState(false);
  const [showRespostaInput, setShowRespostaInput] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemType[]>(
    chamadoSelecionado?.mensagens || []
  );

  useEffect(() => {
    if (!role || !chamadoSelecionado) return;

    const status = chamadoSelecionado.status;

    if (
      (status === "pendente_pelo_operador" && role === "Operador") ||
      role === "Master"
    ) {
      setShowRespostaForm(true);
    } else if (
      status === "pendente_pelo_usuario" &&
      (role === "Admin" || role === "Funcionario")
    ) {
      setShowRespostaForm(true);
    } else {
      setShowRespostaForm(false);
    }
    console.log("role:", role, "status:", status);
  }, [role, chamadoSelecionado]);

  const handleResponder = async (
    data: RespostaFormData,
    arquivos?: UploadedFile[]
  ) => {
    if (data && "preventDefault" in data) {
      setShowRespostaInput(true);
      return;
    }

    if (!showRespostaForm || !data) {
      setShowRespostaInput(true);
      return;
    }

    try {
      const mensagemTemporaria: Partial<MensagemType> = {
        id: Date.now(),
        data_envio: new Date().toISOString(),
        mensagem: data.mensagem,
        ordenacao: 0,
        reacoes: [],
        user: {
          id: 0,
          nome: "Você",
          foto: null,
        },
        anexos: arquivos?.map((file) => ({ id: file.id, arquivo: file })) || [],
      };

      setMensagens((prev) => [...prev, mensagemTemporaria as MensagemType]);

      setShowRespostaInput(false);

      const payload = {
        chamado_id: chamadoSelecionado.id,
        ...data,
      };

      await apiFetchClient({
        method: "POST",
        endpoint: "/mensagem",
        data: payload,
      });
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      alert("Erro ao enviar resposta. Tente novamente.");
    }
  };

  return (
    <div className="bg-[var(--primary)] p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-[var(--extra)]">
            Visualizar Chamado
          </h2>
          <span>
            <Badge label={`Nº ${chamadoSelecionado?.id ?? ""}`} />
          </span>
        </div>
        <Badge label={chamadoSelecionado?.status ?? ""} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="w-full lg:w-4/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DescriptionBox
              type="Solicitante"
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

          <div className="space-y-4 mt-6 bg-[var(--extra)] p-4 rounded shadow-md">
            {mensagens.map((msg, index) => (
              <Mensagem key={msg.id} mensagem={msg} numero={index + 1} />
            ))}

            {showRespostaInput && (
              <div className="mt-4">
                <RespostaChamado
                  handleResponder={(data) => handleResponder(data)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/5 sticky top-40 self-start ">
          <InfoChamado
            chamado={chamadoSelecionado}
            showRespostaForm={showRespostaForm}
            handleResponder={() => setShowRespostaInput(true)}
            showRespostaInput={showRespostaInput}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizarChamado;
