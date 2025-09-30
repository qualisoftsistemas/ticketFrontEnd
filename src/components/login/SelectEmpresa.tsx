"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Select from "../ui/select";
import { useEmpresaStore } from "@/store/empresaStore";

const SelectEmpresa: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number | null>(null);

  const { fetchEmpresas, empresas, setEmpresaSelecionada, setConglomeradoId } =
    useEmpresaStore();

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const handleSelectEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpresa) return;

    setLoading(true);
    try {
      const empresa = empresas.find((e) => e.id === selectedEmpresa) || null;
      if (empresa) {
        setEmpresaSelecionada(empresa);
        setConglomeradoId(empresa.conglomerado_id || null); // ✅ salva conglomerado_id
      }

      router.push("/dashboard"); // ✅ redireciona (ajuste para a rota certa)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md w-full mx-auto rounded-lg bg-[var(--primary)]"
      onSubmit={handleSelectEmpresa}
    >
      <div className="bg-[var(--secondary)] p-3 rounded-t-md">
        <h1 className="text-center text-2xl font-bold text-[var(--secondary-foreground)]">
          Seleção de Empresa
        </h1>
      </div>
      <div className="p-8 flex flex-col gap-4 items-center">
        <div className="my-8">
          <Select
            label="Empresa"
            options={empresas.map((e) => ({ id: e.id, label: e.nome }))}
            onSelect={(option) => setSelectedEmpresa(Number(option.id))}
            placeholder="Selecione a empresa"
          />
        </div>
        <Button
          type="submit"
          variant={"default"}
          disabled={loading || !selectedEmpresa}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
};

export default SelectEmpresa;
