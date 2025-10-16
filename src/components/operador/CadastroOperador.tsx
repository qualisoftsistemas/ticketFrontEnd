"use client";
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Operador } from "@/types/Operador";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import ModalImage from "../ui/modalImage";
import { showRequestToast } from "../ui/toast";
import FileBadge from "../ui/fileBadge";
import InputFile, { UploadedFile } from "../ui/inputFile";

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
      nome: initialData?.nome || "",
      senha: "",
    });
    setFotoId(initialData?.foto_id || null);
  }, [initialData, reset]);

  const nomeValue = watch("nome");
  const senhaValue = watch("senha");

  const handleFormSubmit = (data: FormData) => {
    const payload: Partial<Operador> = {
      ...data,
      foto_id: fotoId === null ? undefined : fotoId,
    };

    if (initialData?.id && !data.senha) {
      delete payload.senha;
    }

    onSubmit(payload);
  };
  useEffect(() => {
    setFotoAtual(initialData?.foto?.url || null);
  }, [initialData]);
  return (
    <>
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
            type="password"
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

          {/* Foto */}
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
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
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
              : fotoAtual && (
                  <div className="relative group w-20 h-20 rounded overflow-hidden shadow">
                    <img
                      src={fotoAtual}
                      alt="Foto atual"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFotoAtual(null); // aqui substituímos a foto antiga
                          setFotoId(null);
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
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
