"use client";

import React, { useEffect, useState } from "react";
import { useRotinaStore } from "@/store/arquivosStore";
import Table from "../table/Table";
import { Column } from "../table/TableGeneric";
import ModalDetalhes from "./ModalDetalhes";
import { Rotina, Upload } from "@/types/Arquivo";

export default function RotinasPage() {
  const { rotinas, uploads, fetchRotinas, loading } = useRotinaStore();
  const [showModalEnviar, setShowModalEnviar] = useState(false);
  const [modalData, setModalData] = useState<Upload | null>(null);

  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchRotinas(mes, ano);
  }, [mes, ano, fetchRotinas]);

  // Map para buscar uploads por rotina/mês/ano
  const uploadsMap = new Map(
    uploads.map((u) => [`${u.rotina.id}-${u.mes}-${u.ano}`, u])
  );

  const handleShowModalEnviar = (rotina: Rotina) => {
    const key = `${rotina.id}-${mes}-${ano}`;
    const upload = uploadsMap.get(key) ?? null;
    setModalData(upload);
    setShowModalEnviar(true);
  };

  const columns: Column<Rotina>[] = [
    { header: "ID", key: "id" },
    { header: "Nome da Rotina", key: "nome" },
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
        <select
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="border rounded p-2"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>

        <select
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          className="border rounded p-2"
        >
          {[2024, 2025, 2026].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <Table
        columns={columns}
        data={rotinas}
        loading={loading}
        showCadastro={() => {}}
        legendasAcoes={[]}
        pagination={null}
        onRowClick={handleShowModalEnviar}
        onPageChange={() => {}}
        searchTerm={""}
        onSearchChange={() => {}}
        setSearchTerm={() => {}}
      />

      {/* Modal Detalhes */}
      {showModalEnviar && modalData && (
        <ModalDetalhes
          modalData={modalData}
          setModalData={setModalData}
          mes={mes}
          ano={ano}
        />
      )}
    </div>
  );
}
