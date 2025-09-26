"use client";
import { useEffect } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Empresa } from "@/types/Empresa";
import { useConglomeradoStore } from "@/store/conglomeradoStore";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "@/components/ui/select";
// Se quiser usar componente custom de CPF/CNPJ:
// import CpfCnpjInput from "../ui/cpfCnpjInput";

const schema = z.object({
  id: z.number().optional(),
  conglomerado_id: z.number().min(1, "Conglomerado é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(14, "CNPJ é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Empresa>) => void;
  initialData?: Empresa | null;
}

export default function CadastroEmpresa({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: initialData?.nome || "",
      cnpj: initialData?.cnpj || "",
      conglomerado_id: initialData?.conglomerado_id || undefined,
    },
  });

  const { conglomerados, fetchConglomerados } = useConglomeradoStore();

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
      cnpj: initialData?.cnpj || "",
      conglomerado_id: initialData?.conglomerado?.id || undefined,
    });
  }, [initialData, reset]);

  useEffect(() => {
    fetchConglomerados();
    if (initialData?.conglomerado_id) {
      setValue("conglomerado_id", initialData.conglomerado_id, {
        shouldValidate: true,
      });
    }
  }, [fetchConglomerados, initialData, setValue]);

  const conglomeradoOptions: SelectOption[] = conglomerados.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  const conglomeradoIdValue = watch("conglomerado_id");
  const nomeValue = watch("nome");
  const cnpjValue = watch("cnpj");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
        Cadastro de Empresa
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}

        {/* Conglomerado */}
        <Controller
          name="conglomerado_id"
          control={control}
          render={({ field }) => {
            const selectedOption =
              conglomeradoOptions.find((opt) => opt.id === field.value) || null;

            return (
              <Select
                label="Conglomerado"
                options={conglomeradoOptions}
                placeholder="Selecione o conglomerado"
                selectedOption={selectedOption}
                onSelect={(option) => {
                  field.onChange(Number(option.id));
                }}
              />
            );
          }}
        />
        {errors.conglomerado_id && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.conglomerado_id.message}
          </p>
        )}

        {/* Nome */}
        <InputText
          label="Nome"
          labelColor="text-[var(--extra)]"
          value={nomeValue}
          onChange={(val) => setValue("nome", val, { shouldValidate: true })}
          placeholder="Digite o nome da empresa"
        />
        {errors.nome && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.nome.message}
          </p>
        )}

        <InputText
          label="CNPJ"
          labelColor="text-[var(--extra)]"
          value={cnpjValue}
          onChange={(val) => setValue("cnpj", val, { shouldValidate: true })}
          placeholder="Digite o CNPJ"
        />
        {errors.cnpj && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.cnpj.message}
          </p>
        )}
        {/*
        <CpfCnpjInput
          value={cnpjValue}
          onChange={(val) => setValue("cnpj", val, { shouldValidate: true })}
        />
        */}

        <div className="flex justify-end gap-3 w-full">
          <Button variant="confirm" type="submit">
            Salvar
          </Button>
          <Button variant="destructive" type="button" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
