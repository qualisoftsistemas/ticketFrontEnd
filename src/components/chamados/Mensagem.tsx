"use client";

import { formatDate } from "@/app/utils/formatDate";
import React from "react";

interface User {
  id: number;
  nome: string;
  foto: string | null;
}

interface Anexo {
  id: number;
  nome: string;
  url: string;
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
}

const Mensagem: React.FC<MensagemProps> = ({ mensagem, numero }) => {
  return (
    <div className="bg-[var(--extra)] p-4 rounded  shadow-md space-y-2   text-[var(--primary)]">
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
            <a
              key={anexo.id}
              href={anexo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-[var(--secondary)] rounded hover:bg-[var(--extra)] transition text-sm"
            >
              {anexo.nome}
            </a>
          ))}
        </div>
      )}

      <hr />
    </div>
  );
};

export default Mensagem;
