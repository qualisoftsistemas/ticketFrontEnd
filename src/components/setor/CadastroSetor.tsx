import React, { useEffect } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Setor } from "@/types/Setor";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";

const schema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Setor>) => void;
  initialData?: Setor | null;
}

export default function CadastroSetor({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? { nome: "" },
  });

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
    });
  }, [initialData, reset]);

  const nomeValue = watch("nome");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold">Cadastro de Setor</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {initialData?.id && <input type="hidden" {...register("id")} />}

        <InputText
          label="Nome"
          value={nomeValue}
          onChange={(val) => setValue("nome", val)}
          placeholder="Digite o nome do setor"
        />
        {errors.nome && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.nome.message}
          </p>
        )}

        <Button variant={"confirm"} type="submit">
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
