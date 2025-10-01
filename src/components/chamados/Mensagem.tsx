"use client";

import { formatDate } from "@/app/utils/formatDate";
import React from "react";
import FileBadge from "../ui/fileBadge";
import { UploadedFile } from "../ui/inputFile";
import { API_BASE_URL } from "@/service/api";

interface User {
  id: number;
  nome: string;
  foto: string | null;
}

interface Anexo {
  id: number;
  arquivo: UploadedFile;
}

interface MensagemType {
  id: number;
  data_envio: string;
  mensagem: string;
  user: User;
  anexos: Anexo[];
}

interface MensagemProps {
  mensagem: MensagemType;
  numero: number;
  // mensagens: MensagemType[];
  showRespostaInput?: boolean;
}

const Mensagem: React.FC<MensagemProps> = ({
  mensagem,
  numero,
  showRespostaInput,
}) => {
  const downloadAnexo = async (anexo: Anexo) => {
    if (!anexo.arquivo && !anexo.id) {
      throw new Error("Anexo inválido");
    }

    const token = localStorage.getItem("token");

    try {
      if (anexo.arquivo?.url) {
        window.open(anexo.arquivo.url, "_blank");
        return;
      }

      if (anexo.id) {
        const res = await fetch(
          `${API_BASE_URL}/arquivo/download/${anexo.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Falha ao baixar o arquivo");

        const blob = await res.blob();
        const fileUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = anexo.arquivo?.nome || "arquivo";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(fileUrl);
      }
    } catch (error) {
      console.error("Erro ao baixar anexo:", error);
    }
  };

  return (
    <div className="bg-[var(--extra)] p-4 rounded space-y-2   text-[var(--primary)]">
      <div className="flex flex-col gap-4">
        <div className="text-lg text-muted-foreground flex items-center gap-2">
          <span className="w-10 h-10 flex items-center justify-center rounded-full font-bold bg-[var(--secondary)] text-[var(--primary)]">
            {numero}
          </span>
          • {formatDate(mensagem.data_envio)}
        </div>

        <div className="flex items-center gap-2">
          {mensagem.user.foto ? (
            <img
              src={mensagem.user.foto}
              alt={mensagem.user.nome}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--neutral)] flex items-center justify-center text-[var(--primary)] font-bold">
              {mensagem.user.nome[0]}
            </div>
          )}
          <span className="font-semibold">{mensagem.user.nome}</span>
        </div>
      </div>

      <div
        className="prose max-w-full  p-4 rounded  text-[var(--primary)]"
        dangerouslySetInnerHTML={{ __html: mensagem.mensagem }}
      ></div>

      {mensagem.anexos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {mensagem.anexos.map((anexo) => (
            <div className="flex flex-wrap gap-2">
              <FileBadge
                key={anexo.id}
                file={anexo.arquivo}
                onClick={() => downloadAnexo(anexo)}
                fileIcon={
                  anexo?.arquivo?.extension?.match(
                    /(jpg|jpeg|png|gif|bmp|webp)$/i
                  ) ? (
                    <img
                      src="/Icons/Eye.svg"
                      alt="Eye"
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <img
                      src="/Icons/Download.svg"
                      alt="Download"
                      className="w-6 h-6 object-contain"
                    />
                  )
                }
              />
            </div>
          ))}
        </div>
      )}

      <hr />
    </div>
  );
};

export default Mensagem;
