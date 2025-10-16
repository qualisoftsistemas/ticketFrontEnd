"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import InputFile, { UploadedFile } from "../ui/inputFile";
import Tiptap from "../ui/richText";
import FileBadge from "../ui/fileBadge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const schema = z.object({
  mensagem: z.string().min(1, "Mensagem obrigatória"),
  arquivos_ids: z.array(z.number()).optional(),
});
export type RespostaFormData = z.infer<typeof schema>;

interface RespostaChamadoProps {
  handleResponder: (data: RespostaFormData, arquivos?: UploadedFile[]) => void;
  respostaRef: React.RefObject<HTMLFormElement | null>;
}

const RespostaChamado = ({
  handleResponder,
  respostaRef,
}: RespostaChamadoProps) => {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<RespostaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      mensagem: "",
      arquivos_ids: [],
    },
  });

  const onSubmit = (data: RespostaFormData) => {
    handleResponder(data, uploadedFiles);
    reset();
    setUploadedFiles([]);
  };

  const handleRemoveFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

    const currentIds = getValues("arquivos_ids") || [];
    const newIds = currentIds.filter((id) => id !== fileId);
    setValue("arquivos_ids", newIds, { shouldValidate: true });
  };

  return (
    <form
      ref={respostaRef}
      className="flex flex-col gap-4 mt-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Campo de mensagem */}
      <Controller
        name="mensagem"
        control={control}
        render={({ field }) => (
          <Tiptap
            value={field.value}
            onChange={(html) => field.onChange(html)}
          />
        )}
      />
      {errors.mensagem && (
        <p className="text-[var(--destructive)] text-sm">
          {errors.mensagem.message}
        </p>
      )}

      {/* Upload de arquivos */}
      <Controller
        name="arquivos_ids"
        control={control}
        render={({ field }) => (
          <InputFile
            multiple
            onUpload={(uploaded) => {
              const newIds = uploaded.map((u) => u.id);
              field.onChange([...(field.value || []), ...newIds]);
              setUploadedFiles((prev) => [...prev, ...uploaded]);
            }}
          />
        )}
      />

      {/* Lista de anexos com overlay */}
      <div className="flex flex-wrap gap-2">
        {uploadedFiles.map((file) => (
          <div key={file.id} className="relative group">
            <FileBadge
              file={file}
              fileIcon={
                file.extension?.match(/(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                  <img
                    src="/Icons/Image.svg"
                    alt="Preview"
                    className="w-5 h-5"
                  />
                ) : (
                  <img
                    src="/Icons/File.svg"
                    alt="Arquivo"
                    className="w-5 h-5"
                  />
                )
              }
            />

            <button
              type="button"
              onClick={() => handleRemoveFile(file.id)}
              className="absolute cursor-pointer top-0 right-0 bg-[var(--destructive)] text-white rounded-full p-1 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                         translate-x-1/4 -translate-y-1/4 shadow-md"
              title="Remover anexo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Button type="submit">Enviar</Button>
    </form>
  );
};

export default RespostaChamado;
