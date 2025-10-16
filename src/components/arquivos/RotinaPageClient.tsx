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
import Icon from "../ui/icon";

export default function RotinasPage() {
  const { rotinas, uploads, fetchRotinas, loading, toggleRotina } =
    useRotinaStore();
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

  const handleToggleAtivo = (rotina: Rotina) => {
    const newAtivo = rotina.ativo ? 0 : 1;

    useRotinaStore.setState((state) => ({
      rotinas: state.rotinas.map((s) =>
        s.id === rotina.id ? { ...s, ativo: newAtivo } : s
      ),
    }));

    toggleRotina(rotina.id ?? 0).catch(() => {
      useRotinaStore.setState((state) => ({
        rotinas: state.rotinas.map((s) =>
          s.id === rotina.id ? { ...s, ativo: rotina.ativo } : s
        ),
      }));
    });
  };

  const columns: Column<Rotina>[] = [
    {
      header: "Ver",  
      key: "visualizar" as keyof Rotina,
      render: () => (
        <div className="flex justify-center">
          <Icon
            icon="/Icons/Eye.svg"
            className="w-5 h-5 cursor-pointer bg-[var(--primary-foreground)]"
          />
        </div>
      ),
    },
    {
      header: "Categoria",
      key: "categoria" as keyof Rotina,
      render: (c) => c.categoria?.nome ?? "-",
    },
    { header: "Arquivo", key: "nome" },
    {
      header: "Status",
      key: "status" as keyof Rotina,
      render: (rotina: Rotina) => {
        const key = `${rotina.id}-${mes}-${ano}`;
        const upload = uploadsMap.get(key);
        return (
          <span
            className={`px-2 py-1 rounded flex items-center justify-center ${
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
        if (!upload || !upload.arquivos) return "-";
        const firstFile = upload.arquivos[0] ?? null;
        return (
          <span className="flex gap-2">
            {firstFile ? (
              <span>
                {firstFile.name}
              </span>
            ) : (
              <span>-</span>
            )}
            {upload.arquivos.length > 1 && (
              <span className="text-[var(--secondary)] ">
                + {upload.arquivos.length - 1}
              </span>
            )}
          </span>
        );
      },
    },
    ...(role === "Master" || role === "Operador"
      ? [
          {
            header: "Ações",
            key: "actions" as keyof Rotina,
            render: (rotina: Rotina) => (
              <div className="flex justify-start gap-4 py-1">
                <Icon
                  icon={
                    rotina.ativo ? "/Icons/LightOn.svg" : "/Icons/LightOff.svg"
                  }
                  className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
                  onClick={() => handleToggleAtivo(rotina)}
                />
              </div>
            ),
          },
        ]
      : []),
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
        onRowClick={(rotina) =>
          role === "Admin" || role === "Funcionario"
            ? handleShowModalEnviar(rotina)
            : undefined
        }
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
