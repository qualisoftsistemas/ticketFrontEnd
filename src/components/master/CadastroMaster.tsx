"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Master } from "@/types/Master";
import { usePrestadorStore } from "@/store/prestadorStore";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "@/components/ui/select";
import { showRequestToast } from "../ui/toast";
import InputFile, { UploadedFile } from "../ui/inputFile";
import FileBadge from "../ui/fileBadge";

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

  const [fotoId, setFotoId] = useState<number | null>(
    initialData?.foto_id || null
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fotoAtual, setFotoAtual] = useState<string | null>(
    initialData?.foto?.url || null
  );
  useEffect(() => {
    reset({
      id: initialData?.id,
      prestador_id: initialData?.prestador?.id || undefined,
      nome: initialData?.nome || "",
      senha: "",
    });
    setFotoId(initialData?.foto_id || null);
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
    const payload: Partial<Master> = {
      ...data,
      foto_id: fotoId === null ? undefined : fotoId,
    };

    if (initialData?.id && !data.senha) {
      delete payload.senha;
    }

    onSubmit(payload as Partial<Master>);
  };
  useEffect(() => {
    setFotoAtual(initialData?.foto?.url || null);
  }, [initialData]);
  return (
    <>
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
            type="password"
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
          <div className="flex flex-col items-center justify-center ">
            <InputFile
              multiple={false}
              accept="image/*"
              label="Selecionar Foto"
              onUpload={(files) => {
                const uploaded = files.slice(0, 1);
                setUploadedFiles(uploaded);
                if (uploaded[0]?.id) {
                  setFotoId(uploaded[0].id);
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.length > 0
                ? uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="relative group w-20 h-20 rounded overflow-hidden shadow"
                    >
                      <img
                        src={file.url}
                        alt={file.nome}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="text-xs px-2 py-1"
                          onClick={() => {
                            setUploadedFiles([]);
                            setFotoId(null);
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))
                : // Caso tenha foto já salva
                  initialData?.foto?.url && (
                    <div className="relative group w-20 h-20 rounded overflow-hidden shadow">
                      <img
                        src={initialData.foto.url}
                        alt="Foto atual"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="text-xs px-2 py-1"
                          onClick={() => {
                            setFotoId(null);
                            setUploadedFiles([]);
                          }}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  )}
            </div>
          </div>
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
    </>
  );
}
