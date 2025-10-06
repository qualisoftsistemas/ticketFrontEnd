"use client";

import { useEffect } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Master } from "@/types/Master";
import { usePrestadorStore } from "@/store/prestadorStore";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "@/components/ui/select";

// 🔹 Schema: senha obrigatória só na criação
const schema = z
  .object({
    id: z.number().optional(),
    prestador_id: z.number().min(1, "Prestador é obrigatório"),
    nome: z.string().min(1, "Nome é obrigatório"),
    senha: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.senha) {
      ctx.addIssue({
        path: ["senha"],
        message: "Senha é obrigatória ao criar um master",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Master>) => void;
  initialData?: Master | null;
}

export default function CadastroMaster({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const { prestadores, fetchPrestadores } = usePrestadorStore();

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
      id: initialData?.id,
      prestador_id: initialData?.prestador?.id || undefined,
      nome: initialData?.nome || "",
      senha: "",
    },
  });

  useEffect(() => {
    reset({
      id: initialData?.id,
      prestador_id: initialData?.prestador?.id || undefined,
      nome: initialData?.nome || "",
      senha: "",
    });
  }, [initialData, reset]);

  useEffect(() => {
    fetchPrestadores();
    if (initialData?.prestador_id) {
      setValue("prestador_id", initialData.prestador_id, {
        shouldValidate: true,
      });
    }
  }, [initialData, setValue]);

  const prestadorOptions: SelectOption[] = prestadores
    .filter((p) => p.id !== undefined)
    .map((p) => ({ id: p.id as number, label: p.nome }));

  const nomeValue = watch("nome");
  const senhaValue = watch("senha");

  const handleFormSubmit = (data: FormData) => {
    const payload = { ...data };
    // Remove senha se estiver editando e campo estiver vazio
    if (initialData?.id && !data.senha) {
      delete payload.senha;
    }
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
        {initialData ? "Editar Master" : "Cadastrar Master"}
      </h2>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6"
      >
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}

        {/* Prestador */}
        <Controller
          name="prestador_id"
          control={control}
          render={({ field }) => {
            const selectedOption =
              prestadorOptions.find((opt) => opt.id === field.value) || null;
            return (
              <Select
                label="Prestador"
                options={prestadorOptions}
                placeholder="Selecione o prestador"
                selectedOption={selectedOption}
                onSelect={(option) => field.onChange(Number(option.id))}
              />
            );
          }}
        />
        {errors.prestador_id && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.prestador_id.message}
          </p>
        )}

        {/* Nome */}
        <InputText
          label="Nome"
          labelColor="text-[var(--extra)]"
          value={nomeValue}
          onChange={(val) => setValue("nome", val, { shouldValidate: true })}
          placeholder="Digite o nome do master"
        />
        {errors.nome && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.nome.message}
          </p>
        )}

        {/* Senha */}
        <InputText
          label="Senha"
          labelColor="text-[var(--extra)]"
          value={senhaValue}
          onChange={(val) => setValue("senha", val, { shouldValidate: true })}
          placeholder={
            initialData?.id
              ? "Deixe em branco para manter a senha atual"
              : "Digite a senha do master"
          }
        />
        {errors.senha && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.senha.message}
          </p>
        )}

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
