"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Select, { SelectOption } from "../ui/select";
import { useEmpresaStore } from "@/store/empresaStore";
import Modal from "../ui/modal";

const SelectEmpresa: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<SelectOption | null>(
    null
  );

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
      const empresa =
        empresas.find((e) => e.id === selectedEmpresa?.id) || null;
      if (empresa) {
        setEmpresaSelecionada(empresa);
        setConglomeradoId(empresa.conglomerado_id || null);
      }

      router.push("/chamados");
    } finally {
      setLoading(false);
    }
  };

  return (
    Modal
  );
};

export default SelectEmpresa;
