"use client";
import { useEffect } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Categoria } from "@/types/Categoria";
import { useSetorStore } from "@/store/setorStore";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "@/components/ui/select";

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
      setor_id: initialData?.setor_id || undefined,
    },
  });

  const { setores, fetchSetores } = useSetorStore();

  useEffect(() => {
    reset({
      nome: initialData?.nome || "",
      setor_id: initialData?.setor?.id || undefined,
    });
  }, [initialData, reset]);

  useEffect(() => {
    fetchSetores();
    if (initialData?.setor_id) {
      setValue("setor_id", initialData.setor_id, { shouldValidate: true });
    }
  }, [fetchSetores, initialData, setValue]);

  const setorOptions: SelectOption[] = setores.map((s) => ({
    id: s.id,
    label: s.nome,
  }));

  const setorIdValue = watch("setor_id");
  const nomeValue = watch("nome");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold">Cadastro de Categoria</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}

        <Controller
          name="setor_id"
          control={control}
          render={({ field }) => {
            const selectedOption =
              setorOptions.find((opt) => opt.id === field.value) || null;

            return (
              <Select
                label="Setor"
                options={setorOptions}
                placeholder="Selecione o setor"
                selectedOption={selectedOption}
                onSelect={(option) => {
                  field.onChange(Number(option.id));
                }}
              />
            );
          }}
        />
        {errors.setor_id && (
          <p className="text-red-500 text-sm">{errors.setor_id.message}</p>
        )}

        <InputText
          label="Nome"
          value={nomeValue}
          onChange={(val) => setValue("nome", val, { shouldValidate: true })}
          placeholder="Digite o nome da categoria"
        />
        {errors.nome && (
          <p className="text-red-500 text-sm">{errors.nome.message}</p>
        )}

        <Button variant="confirm" type="submit">
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
