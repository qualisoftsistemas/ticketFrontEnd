"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/modal"; // <-- usa o seu componente
import { Button } from "@/components/ui/button";
import { useRotinaStore } from "@/store/arquivosStore";
import { useEmpresaStore } from "@/store/empresaStore";
import { useSetorStore } from "@/store/setorStore";
import { useCategoriaStore } from "@/store/categoriaStore";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select, { SelectOption } from "../ui/select";
import InputText from "@/components/ui/inputText";
import { showRequestToast } from "../ui/toast";

const schema = z.object({
  empresa_id: z.number().min(1, "Selecione uma empresa"),
  nome: z
    .string()
    .nonempty("O nome é obrigatório")
    .min(2, "O nome deve ter pelo menos 2 caracteres"),
  categoria_id: z.number().min(1, "Selecione uma categoria"),
  setor_id: z.number().min(1, "Selecione um setor"),
});

type FormData = z.infer<typeof schema>;

interface ModalCadastroDiceProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalCadastroDice({
  open,
  onClose,
}: ModalCadastroDiceProps) {
  const { createRotina, fetchRotinas } = useRotinaStore();
  const { empresas, fetchEmpresas, empresaSelecionada } = useEmpresaStore();
  const { fetchSetores, setores } = useSetorStore();
  const { fetchCategorias, categorias } = useCategoriaStore();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      empresa_id: empresaSelecionada?.id || 0,
      setor_id: 0,
      categoria_id: 0,
      nome: "",
    },
  });

  const selectedEmpresaId = watch("empresa_id");
  const selectedSetorId = watch("setor_id");
  const selectedCategoriaId = watch("categoria_id");

  // Buscar empresas
  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  // Buscar setores quando empresa muda
  useEffect(() => {
    if (selectedEmpresaId) {
      fetchSetores();
      setValue("setor_id", 0);
      setValue("categoria_id", 0);
    }
  }, [selectedEmpresaId, fetchSetores, setValue]);

  // Buscar categorias quando setor muda
  useEffect(() => {
    if (selectedSetorId && selectedEmpresaId) {
      fetchCategorias({ setor_id: selectedSetorId });
      setValue("categoria_id", 0);
    }
  }, [selectedSetorId, selectedEmpresaId, fetchCategorias, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createRotina({
        empresa_id: data.empresa_id,
        nome: data.nome,
        setor_id: data.setor_id,
        categoria_id: data.categoria_id,
      });

      showRequestToast("success", "Arquivo cadastrado com sucesso!");
      await fetchRotinas?.();
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      showRequestToast("error", "Erro ao cadastrar arquivo");
    } finally {
      setLoading(false);
    }
  };

  const empresasOptions: SelectOption[] = empresas.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  const setoresOptions: SelectOption[] = setores.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  const categoriasOptions: SelectOption[] = categorias.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-md">
      <h2 className="text-xl font-semibold text-[var(--extra)] mb-4">
        Cadastro de novo DICE
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        {/* Empresa */}
        <Controller
          name="empresa_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Empresa"
              options={empresasOptions}
              placeholder="Selecione a empresa"
              selectedOption={
                empresasOptions.find((opt) => opt.id === selectedEmpresaId) ||
                null
              }
              onSelect={(option) => {
                field.onChange(Number(option.id));
                setValue("setor_id", 0);
                setValue("categoria_id", 0);
              }}
            />
          )}
        />
        {errors.empresa_id && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.empresa_id.message}
          </p>
        )}

        {/* Nome */}
        <Controller
          name="nome"
          control={control}
          render={({ field }) => (
            <InputText
              label="Nome"
              labelColor="text-[var(--extra)]"
              value={field.value}
              onChange={(val) =>
                setValue("nome", val, { shouldValidate: true })
              }
              placeholder="Digite o nome do arquivo"
            />
          )}
        />
        {errors.nome && (
          <p className="text-[var(--destructive)] text-sm mt-1">
            {errors.nome.message}
          </p>
        )}

        {/* Setor */}
        <Controller
          name="setor_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Setor"
              options={setoresOptions}
              placeholder="Selecione o setor"
              disabled={setoresOptions.length === 0}
              selectedOption={
                setoresOptions.find((opt) => opt.id === selectedSetorId) || null
              }
              onSelect={(option) => {
                field.onChange(Number(option.id));
                setValue("categoria_id", 0);
              }}
            />
          )}
        />
        {errors.setor_id && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.setor_id.message}
          </p>
        )}

        {/* Categoria */}
        <Controller
          name="categoria_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Categoria"
              options={categoriasOptions}
              placeholder="Selecione a categoria"
              disabled={categoriasOptions.length === 0}
              selectedOption={
                categoriasOptions.find(
                  (opt) => opt.id === selectedCategoriaId
                ) || null
              }
              onSelect={(option) => field.onChange(Number(option.id))}
            />
          )}
        />
        {errors.categoria_id && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.categoria_id.message}
          </p>
        )}

        {/* Botões */}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
