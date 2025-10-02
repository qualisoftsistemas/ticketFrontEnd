'use client";';
import { useEffect, useState } from "react";
import { ChamadoApiResponse } from "@/types/Chamado";
import DescriptionBox from "../ui/descriptionBox";
import React from "react";
import Badge from "../ui/badge";
import Mensagem from "./Mensagem";
import InfoChamado from "./InfoChamado";
import { Role, useUserRole } from "@/hooks/useUserRole";
import RespostaChamado from "./RespostaChamado";
import apiFetchClient from "@/service/api";
import type { RespostaFormData } from "./RespostaChamado";
import { UploadedFile } from "../ui/inputFile";
import { MensagemType } from "./Mensagem";
import { useRouter } from "next/navigation";
import ModalFinalizarChamado from "./ModalFinalizarChamado";
import ModalAvaliacao from "./ModalAvaliação";

export interface VisualizarChamadoProps {
  chamado: ChamadoApiResponse | null;
}

const VisualizarChamado = ({ chamado }: VisualizarChamadoProps) => {
  if (!chamado) return null;
  const chamadoSelecionado = chamado.chamado;
  const router = useRouter();

  const role = useUserRole();
  const [showRespostaForm, setShowRespostaForm] = useState(false);
  const [showRespostaInput, setShowRespostaInput] = useState(false);
  const [showModalFinalizar, setShowModalFinalizar] = useState(false);
  const [showModalAvaliar, setShowModalAvaliar] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemType[]>(
    chamadoSelecionado?.mensagens || []
  );
  useEffect(() => {
    setMensagens([]);
    setShowModalAvaliar(false);
    setShowModalFinalizar(false);
    setShowRespostaForm(false);
    setShowRespostaInput(false);
  }, []);

  useEffect(() => {
    if (!role || !chamadoSelecionado) return;

    setShowRespostaForm(false);
    setShowModalAvaliar(false);
    setShowModalFinalizar(false);

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
    } else if (status === "aguardando_avaliacao" && role === "Admin") {
      setShowModalAvaliar(true);
    }
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

  const handleFinalizar = async () => {
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/encerrar_chamado`,
        data: {
          chamado_id: chamadoSelecionado.id,
        },
      });

      router.push("/chamados");
    } catch (error) {
      console.error("Erro ao finalizar chamado:", error);
      alert("Erro ao finalizar chamado. Tente novamente.");
    }
  };

  const handleAvaliacao = async (nota: number, comentario: string) => {
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/avaliar_chamado`,
        data: {
          chamado_id: chamadoSelecionado.id,
          avaliacao: nota,
          observacao: comentario,
        },
      });

      router.push("/chamados");
    } catch (error) {
      console.error("Erro ao avaliar chamado:", error);
      alert("Erro ao avaliar chamado. Tente novamente.");
    }
  };
  const handleCloseModalAvaliar = () => {
    setShowModalAvaliar(false);

    router.push("/chamados");
  };

  useEffect(() => {
    setMensagens(chamadoSelecionado?.mensagens || []);
  }, [chamadoSelecionado]);

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
        <div className="w-full space-y-4">
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

          <div className="flex gap-4">
            <div className="w-full space-y-2 bg-[var(--extra)] p-1 rounded">
              {mensagens.map((msg, index) => (
                <Mensagem key={msg.id} mensagem={msg} numero={index + 1} />
              ))}

              {showRespostaInput && (
                <div className="mt-2">
                  <RespostaChamado
                    handleResponder={(data) => handleResponder(data)}
                  />
                </div>
              )}
            </div>
            <div className="sticky top-0">
              <InfoChamado
                chamado={chamadoSelecionado}
                showRespostaForm={showRespostaForm}
                handleResponder={() => setShowRespostaInput(true)}
                showRespostaInput={showRespostaInput}
                role={role as Role}
                handleFinalizar={() => setShowModalFinalizar(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {showModalFinalizar && (
        <ModalFinalizarChamado
          isOpen={showModalFinalizar}
          onClose={() => setShowModalFinalizar(false)}
          onConfirm={handleFinalizar}
        />
      )}

      {showModalAvaliar && (
        <ModalAvaliacao
          isOpen={showModalAvaliar}
          onClose={handleCloseModalAvaliar}
          onConfirm={(nota, comentario) => handleAvaliacao(nota, comentario)}
        />
      )}
    </div>
  );
};

export default VisualizarChamado;
