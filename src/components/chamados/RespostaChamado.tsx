"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import InputFile, { UploadedFile } from "../ui/inputFile";
import Tiptap from "../ui/richText";
import FileBadge from "../ui/fileBadge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

const schema = z.object({
  mensagem: z.string().min(5, "Mensagem obrigatória"),
  arquivos_ids: z.array(z.number()).optional(),
});
export type RespostaFormData = z.infer<typeof schema>;

interface RespostaChamadoProps {
  handleResponder: (data: RespostaFormData, arquivos?: UploadedFile[]) => void;
}

const RespostaChamado = ({ handleResponder }: RespostaChamadoProps) => {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RespostaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      arquivos_ids: [],
    },
  });

  const onSubmit = (data: RespostaFormData) => {
    handleResponder(data, uploadedFiles); 
    reset();
    setUploadedFiles([]);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  return (
    <form
      className="flex flex-col gap-4 mt-4"
      onSubmit={handleSubmit(onSubmit)}
    >
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

      <Controller
        name="arquivos_ids"
        control={control}
        render={({ field }) => (
          <InputFile
            multiple
            onUpload={(uploaded) => {
              field.onChange([
                ...(field.value || []),
                ...uploaded.map((u) => u.id),
              ]);
              setUploadedFiles((prev) => [...prev, ...uploaded]);
            }}
          />
        )}
      />

      <div className="flex flex-wrap gap-2">
        {uploadedFiles.map((file) => (
          <FileBadge
            key={file.id}
            file={file}
            fileIcon={
              file.extension?.match(/(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                <img
                  src="/icons/Eye.svg"
                  alt="Eye"
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <img
                  src="/icons/Download.svg"
                  alt="Download"
                  className="w-6 h-6 object-contain"
                />
              )
            }
          />
        ))}
      </div>

      <Button type="submit">Enviar</Button>
    </form>
  );
};

export default RespostaChamado;
