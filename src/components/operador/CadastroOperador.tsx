"use client";
import { useEffect } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Operador } from "@/types/Operador";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";

// 🔹 Validação condicional da senha
const schema = z
  .object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    senha: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.senha) {
      ctx.addIssue({
        path: ["senha"],
        message: "Senha é obrigatória ao criar um operador",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Operador>) => void;
  initialData?: Operador | null;
}

export default function CadastroOperador({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData?.id,
      nome: initialData?.nome || "",
      senha: "",
    },
  });

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
      senha: "",
    });
  }, [initialData, reset]);

  const nomeValue = watch("nome");
  const senhaValue = watch("senha");

  const handleFormSubmit = (data: FormData) => {
    const payload = { ...data };
    // Remove senha se for edição e campo estiver vazio
    if (initialData?.id && !data.senha) {
      delete payload.senha;
    }
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
        {initialData ? "Editar Operador" : "Cadastrar Operador"}
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
          placeholder="Digite o nome do operador"
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
              : "Digite a senha do operador"
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
