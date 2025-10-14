"use client";

import { useEffect } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Admin } from "@/types/Admin";
import { Button } from "../ui/button";
import { useConglomeradoStore } from "@/store/conglomeradoStore";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "../ui/select";

// 🔹 Schema: senha obrigatória só ao criar
const schema = z
  .object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    conglomerado_id: z.number().min(1, "Conglomerado é obrigatório"),
    senha: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.senha) {
      ctx.addIssue({
        path: ["senha"],
        message: "Senha é obrigatória ao criar um admin",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Admin>) => void;
  initialData?: Admin | null;
}

export default function ModalCadastroAdmin({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData?.id,
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      conglomerado_id: initialData?.conglomerado?.id || undefined,
      senha: "",
    },
  });
  const { conglomerados, fetchConglomerados } = useConglomeradoStore();

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      conglomerado_id: initialData?.conglomerado?.id || undefined,
      senha: "",
    });
  }, [initialData, reset]);

  useEffect(() => {
    // 1️⃣ busca o conglomerado do localStorage, se existir
    let savedConglomeradoId: number | undefined = undefined;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("conglomeradoSelecionado");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { id: number };
          savedConglomeradoId = parsed.id;
        } catch (e) {
          console.error("Erro ao ler conglomerado do localStorage", e);
        }
      }
    }

    // 2️⃣ busca os conglomerados do backend
    fetchConglomerados().then(() => {
      // 3️⃣ se não houver initialData, seta o valor do select
      if (!initialData?.conglomerado?.id && savedConglomeradoId) {
        setValue("conglomerado_id", savedConglomeradoId, {
          shouldValidate: true,
        });
      }
    });
  }, [fetchConglomerados, initialData, setValue]);

  const conglomeradoOptions: SelectOption[] = conglomerados.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  const nomeValue = watch("nome");
  const emailValue = watch("email");
  const senhaValue = watch("senha");

  // 🔹 Prepara payload antes de enviar
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
        {initialData ? "Editar Admin" : "Cadastrar Admin"}
      </h2>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6"
      >
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}

        {/* Nome */}
        <InputText
          label="Nome"
          labelColor="text-[var(--extra)]"
          value={nomeValue}
          onChange={(val) => setValue("nome", val, { shouldValidate: true })}
          placeholder="Digite o nome do admin"
        />
        {errors.nome && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.nome.message}
          </p>
        )}

        <InputText
          label="Senha"
          labelColor="text-[var(--extra)]"
          type="password"
          value={senhaValue}
          onChange={(val) => setValue("senha", val, { shouldValidate: true })}
          placeholder={
            initialData?.id
              ? "Deixe em branco para manter a senha atual"
              : "Digite a senha do admin"
          }
        />
        {errors.senha && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.senha.message}
          </p>
        )}
        {/* Email */}
        <InputText
          label="Email"
          labelColor="text-[var(--extra)]"
          value={emailValue}
          onChange={(val) => setValue("email", val, { shouldValidate: true })}
          placeholder="Digite o email do admin"
        />
        {errors.email && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.email.message}
          </p>
        )}

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
