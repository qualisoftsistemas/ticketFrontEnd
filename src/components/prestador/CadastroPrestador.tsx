"use client";
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prestador } from "@/types/Prestador";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import ModalImage from "../ui/modalImage";
import { showRequestToast } from "../ui/toast";
import InputFile, { UploadedFile } from "../ui/inputFile";
import FileBadge from "../ui/fileBadge";

const schema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Prestador>) => void;
  initialData?: Prestador | null;
}

export default function CadastroPrestador({
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
      nome: initialData?.nome || "",
    },
  });

  const [fotoId, setFotoId] = useState<number | null>(
    initialData?.foto_id || null
  );
  const [fotoUrl, setFotoUrl] = useState<string | null>(
    initialData?.foto?.url || null
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
    });
    setFotoId(initialData?.foto_id || null);
    setFotoUrl(initialData?.foto?.url || null);
  }, [initialData, reset]);

  const nomeValue = watch("nome");

  const handleSave = (data: FormData) => {
    const payload = {
      ...data,
      foto_id: fotoId,
    };

    onSubmit(payload as Partial<Prestador>);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
          {initialData ? "Editar Prestador" : "Cadastrar Prestador"}
        </h2>

        <form
          onSubmit={handleSubmit(handleSave)}
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
            placeholder="Digite o nome do prestador"
          />
          {errors.nome && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.nome.message}
            </p>
          )}

          {/* Foto */}
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
