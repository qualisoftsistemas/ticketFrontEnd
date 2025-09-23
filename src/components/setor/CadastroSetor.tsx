import React from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Setor } from "@/types/Setor";
import { Button } from "../ui/button";

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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? { nome: "" },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold">Cadastro de Setor</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {initialData?.id && <input type="hidden" {...register("id")} />}

        <div>
          <label>Nome</label>
          <input
            type="text"
            {...register("nome")}
            className="border p-2 w-full"
          />
          {errors.nome && (
            <p className="text-red-500 text-sm">{errors.nome.message}</p>
          )}
        </div>

        <Button variant={"confirm"} type="submit">
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
