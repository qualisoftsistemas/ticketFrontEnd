"use client";
import React, { useEffect } from "react";
import InputText from "../ui/inputText";
import InputFile, { UploadedFile } from "../ui/inputFile";
import Tiptap from "../ui/richText";
import Select, { SelectOption } from "../ui/select";
import { useEmpresaStore } from "@/store/empresaStore";
import { useSetorStore } from "@/store/setorStore";
import { useCategoriaStore } from "@/store/categoriaStore";
import { useOperadorStore } from "@/store/operadorStore";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FileBadge from "../ui/fileBadge";
import apiFetchClient from "@/service/api";

const schema = z.object({
  empresa_id: z.number().min(1, "Selecione uma empresa"),
  setor_id: z.number().min(1, "Selecione um setor"),
  categoria_id: z.number().min(1, "Selecione uma categoria"),
  operador_id: z.number().min(1, "Selecione um operador"),
  assunto: z.string().min(3, "Assunto obrigatório"),
  mensagem: z.string().min(5, "Mensagem obrigatória"),
  arquivos_ids: z.array(z.number()).optional(),
});

type FormData = z.infer<typeof schema>;

const CadastroChamado = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      arquivos_ids: [],
    },
  });

  const { empresas, fetchEmpresas } = useEmpresaStore();
  const { setores, fetchSetores } = useSetorStore();
  const { categorias, fetchCategorias } = useCategoriaStore();
  const { operadores, fetchOperadores } = useOperadorStore();

  useEffect(() => {
    fetchEmpresas();
    fetchSetores();
    fetchCategorias();
    fetchOperadores();
  }, []);

  const empresasOptions: SelectOption[] = empresas.map((s) => ({
    id: s.id,
    label: s.nome,
  }));

  const setorOptions: SelectOption[] = setores.map((s) => ({
    id: s.id,
    label: s.nome,
  }));

  const categoriaOptions: SelectOption[] = categorias.map((s) => ({
    id: s.id,
    label: s.nome,
  }));

  const operadorOptions: SelectOption[] = operadores.map((s) => ({
    id: s.id,
    label: s.nome,
  }));

  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await apiFetchClient({
        method: "POST",
        endpoint: "/chamado",
        data,
      });
      reset();
      setUploadedFiles([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const onInvalid = (errors: any) => {
    console.log(errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="bg-[var(--primary)] p-6 rounded-lg shadow-md space-y-4"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <Controller
            name="empresa_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Empresa"
                options={empresasOptions}
                placeholder="Selecione a empresa"
                selectedOption={
                  empresasOptions.find((opt) => opt.id === field.value) || null
                }
                onSelect={(option) => field.onChange(Number(option.id))}
              />
            )}
          />
          {errors.empresa_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.empresa_id.message}
            </p>
          )}
        </div>

        <div className="flex-1">
          <Controller
            name="setor_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Setor"
                options={setorOptions}
                placeholder="Selecione o setor"
                selectedOption={
                  setorOptions.find((opt) => opt.id === field.value) || null
                }
                onSelect={(option) => field.onChange(Number(option.id))}
              />
            )}
          />
          {errors.setor_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.setor_id.message}
            </p>
          )}
        </div>

        <div className="flex-1">
          <Controller
            name="categoria_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoria"
                options={categoriaOptions}
                placeholder="Selecione a categoria"
                selectedOption={
                  categoriaOptions.find((opt) => opt.id === field.value) || null
                }
                onSelect={(option) => field.onChange(Number(option.id))}
              />
            )}
          />
          {errors.categoria_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.categoria_id.message}
            </p>
          )}
        </div>

        <div className="flex-1">
          <Controller
            name="operador_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Operador"
                options={operadorOptions}
                placeholder="Selecione o operador"
                selectedOption={
                  operadorOptions.find((opt) => opt.id === field.value) || null
                }
                onSelect={(option) => field.onChange(Number(option.id))}
              />
            )}
          />
          {errors.operador_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.operador_id.message}
            </p>
          )}
        </div>
      </div>

      <InputText
        label="Assunto"
        labelColor="text-[var(--extra)]"
        name="assunto"
        onChange={(val) => setValue("assunto", val, { shouldValidate: true })}
        placeholder="Digite o assunto do chamado"
      />
      {errors.assunto && (
        <p className="text-[var(--destructive)] text-sm">
          {errors.assunto.message}
        </p>
      )}

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
              file?.extension &&
              file.extension.match(/(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
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

      <Button type="submit" variant="confirm" className="text-lg">
        Abrir Chamado
      </Button>
    </form>
  );
};

export default CadastroChamado;
