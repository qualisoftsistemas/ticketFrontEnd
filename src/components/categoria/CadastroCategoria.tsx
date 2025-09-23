import React from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Categoria } from "@/types/Categoria";
import { Button } from "../ui/button";

const schema = z.object({
  id: z.number().optional(),
  setor_id: z.number().min(1, "Setor é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Categoria>) => void;
  initialData?: Categoria | null;
}

export default function CadastroCategoria({
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
    defaultValues: initialData ?? { setor_id: 0, nome: "" },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold">Cadastro de Categoria</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {initialData?.id && <input type="hidden" {...register("id")} />}

        <div>
          <label>Setor</label>
          <input
            type="number"
            {...register("setor_id", { valueAsNumber: true })}
            className="border p-2 w-full"
          />
          {errors.setor_id && (
            <p className="text-red-500 text-sm">{errors.setor_id.message}</p>
          )}
        </div>

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

        <Button variant="confirm" type="submit">
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
