"use client";

import React, { useEffect, useState } from "react";
import { useRotinaStore } from "@/store/arquivosStore";
import Table from "../table/Table";
import { Column } from "../table/TableGeneric";
import ModalDetalhes from "./ModalDetalhes";
import { Rotina, Upload } from "@/types/Arquivo";
import { useUserRole } from "@/hooks/useUserRole";
import Select from "../ui/select";
import { useEmpresaStore } from "@/store/empresaStore";
import { useConglomeradoStore } from "@/store/conglomeradoStore";

import ModalCadastroDice from "./ModalCadastroDICE";
import Modal from "../ui/modal";
import ModalEnviarArquivo from "./ModalEnviar";

export default function RotinasPage() {
  const { rotinas, uploads, fetchRotinas, loading } = useRotinaStore();
  const {
    empresas,
    fetchEmpresas,
    loading: loadingEmpresas,
    empresaSelecionada,
    setEmpresaSelecionada,
  } = useEmpresaStore();

  const [showModalEnviar, setShowModalEnviar] = useState(false);
  const [modalData, setModalData] = useState<Upload | null>(null);
  const [modalCadastro, setModalCadastro] = useState(false);
  const [rotinaSelecionada, setRotinaSelecionada] = useState<Rotina | null>(
    null
  );

  const role = useUserRole();

  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchRotinas(mes, ano);
  }, [mes, ano, fetchRotinas, empresaSelecionada]);

  const uploadsMap = new Map(
    uploads.map((u) => [`${u.rotina.id}-${u.mes}-${u.ano}`, u])
  );

  const handleShowModalEnviar = (rotina: Rotina) => {
    const key = `${rotina.id}-${mes}-${ano}`;
    const upload = uploadsMap.get(key) ?? null;

    if (upload) {
      // Já existe upload: abre modal detalhes
      setModalData(upload);
    } else {
      // Não existe upload: abre modal de envio
      setRotinaSelecionada(rotina);
      setShowModalEnviar(true);
    }
  };

  const columns: Column<Rotina>[] = [
    { header: "ID", key: "id" },
    { header: "Arquivo", key: "nome" },
    {
      header: "Status",
      key: "status" as keyof Rotina,
      render: (rotina: Rotina) => {
        const key = `${rotina.id}-${mes}-${ano}`;
        const upload = uploadsMap.get(key);
        return (
          <span
            className={`px-2 py-1 rounded ${
              upload
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {upload ? upload.status : "Pendente"}
          </span>
        );
      },
    },
    {
      header: "Arquivo Enviado",
      key: "arquivo" as keyof Rotina,
      render: (rotina: Rotina) => {
        const key = `${rotina.id}-${mes}-${ano}`;
        const upload = uploadsMap.get(key);
        return upload ? (
          <button
            onClick={() => setModalData(upload)}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {upload.arquivo.name}
          </button>
        ) : (
          "-"
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Rotinas de Envio</h1>

      <div className="flex gap-3">
        <Select
          label="Mês"
          placeholder="Selecione o mês"
          options={Array.from({ length: 12 }, (_, i) => {
            const m = i + 1;
            return { id: m, label: m.toString().padStart(2, "0") };
          })}
          selectedOption={{ id: mes, label: mes.toString().padStart(2, "0") }}
          onSelect={(option) => setMes(Number(option.id))}
        />

        <Select
          label="Ano"
          placeholder="Selecione o ano"
          options={[2024, 2025, 2026].map((a) => ({
            id: a,
            label: a.toString(),
          }))}
          selectedOption={{ id: ano, label: ano.toString() }}
          onSelect={(option) => setAno(Number(option.id))}
        />

        {(role === "Master" || role === "Operador") && (
          <Select
            label="Empresa"
            placeholder="Selecione a empresa"
            options={empresas.map((e) => ({ id: e.id, label: e.nome }))}
            selectedOption={
              empresaSelecionada
                ? { id: empresaSelecionada.id, label: empresaSelecionada.nome }
                : null
            }
            onSelect={(option) =>
              setEmpresaSelecionada(
                empresas.find((e) => e.id === option.id) ?? null
              )
            }
          />
        )}
      </div>

      <Table
        columns={columns}
        data={rotinas}
        loading={loading}
        showCadastro={
          role !== "Admin" && role !== "Funcionario"
            ? () => setModalCadastro(true)
            : undefined
        }
        legendasAcoes={[]}
        pagination={null}
        onRowClick={(rotina) => handleShowModalEnviar(rotina)}
        onPageChange={() => {}}
        searchTerm={""}
        onSearchChange={() => {}}
        setSearchTerm={() => {}}
      />

      <ModalCadastroDice
        open={modalCadastro}
        onClose={() => setModalCadastro(false)}
      />

      <ModalDetalhes
        modalData={modalData}
        setModalData={setModalData}
        open={!!modalData}
        onClose={() => setModalData(null)}
        mes={mes}
        ano={ano}
      />

      <ModalEnviarArquivo
        open={showModalEnviar}
        onClose={() => setShowModalEnviar(false)}
        rotina={rotinaSelecionada}
        conglomeradoId={empresaSelecionada?.conglomerado?.id ?? 0}
        empresaId={empresaSelecionada?.id ?? 0}
        mes={mes}
        ano={ano}
      />
    </div>
  );
}
