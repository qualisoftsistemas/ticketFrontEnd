"use client";

import { formatDate } from "@/utils/formatDate";
import React from "react";
import FileBadge from "../ui/fileBadge";
import { UploadedFile } from "../ui/inputFile";
import { API_BASE_URL } from "@/service/api";
import {downloadAnexo} from "@/utils/downloadAnexo";

interface User {
  id: number;
  nome: string;
  foto: string | null;
}

export interface Anexo {
  id: number;
  arquivo: UploadedFile;
}

export interface MensagemType {
  id: number;
  data_envio: string;
  mensagem: string;
  user: User;
  reacoes: [];
  ordenacao: number;
  anexos: Anexo[];
}

interface MensagemProps {
  mensagem: MensagemType;
  numero: number;
  showRespostaInput?: boolean;
}

const Mensagem: React.FC<MensagemProps> = ({
  mensagem,
  numero,
  showRespostaInput,
}) => {
  return (
    <div className="bg-[var(--extra)] p-2 rounded space-y-2 text-[var(--primary)]">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="text-lg w-7 h-7 flex justify-center items-center rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)]">
            {numero}
          </span>
          <p className="text-sm">{formatDate(mensagem.data_envio)}</p>
        </div>

        <div className="flex items-center gap-2">
          {mensagem.user.foto ? (
            <img
              src={mensagem.user.foto}
              alt={mensagem.user.nome}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[var(--neutral)] flex items-center justify-center text-[var(--primary)] font-bold">
              {mensagem.user.nome[0]}
            </div>
          )}
          <span className="font-semibold text-sm">{mensagem.user.nome}</span>
        </div>
      </div>

      <div
        className="p-2 rounded text-[var(--primary)] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
        dangerouslySetInnerHTML={{ __html: mensagem.mensagem }}
      ></div>

      {mensagem.anexos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {mensagem.anexos.map((anexo) => (
            <div key={anexo.id} className="flex flex-wrap gap-2">
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
