"use client";
import React, { useEffect, useState } from "react";
import InputText from "../ui/inputText";
import InputFile, { UploadedFile } from "../ui/inputFile";
import Tiptap from "../ui/richText";
import Select, { SelectOption } from "../ui/select";
import { Controller, useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FileBadge from "../ui/fileBadge";
import apiFetchClient from "@/service/api";
import { useRouter } from "next/navigation";

const schema = z.object({
  empresa_id: z.number().min(1, "Selecione uma empresa"),
  setor_id: z.number().min(1, "Selecione um setor"),
  categoria_id: z.number().min(1, "Selecione uma categoria"),
  operador_id: z.number().min(1, "Selecione um operador"),
  assunto: z.string().min(3, "Assunto obrigatório"),
  mensagem: z.string().min(5, "Mensagem obrigatória"),
  arquivos_ids: z.array(z.number()).optional(),
});

interface SelectsData {
  setores: { id: number; nome: string }[];
  categorias: { id: number; nome: string }[];
  empresas: { id: number; nome: string }[];
  operadores: { id: number; nome: string; foto?: string | null }[];
}
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

  const router = useRouter();

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [operadores, setOperadores] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const fetchSelectsData = async () => {
      try {
        const data = await apiFetchClient<SelectsData>({
          method: "GET",
          endpoint: "/abrir_chamado_selects",
        });

        setEmpresas(data.empresas || []);
        setSetores(data.setores || []);
        setCategorias(data.categorias || []);
        setOperadores(data.operadores || []);
      } catch (err) {
        console.error("Erro ao buscar selects:", err);
      }
    };

    fetchSelectsData();
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

  const onSubmit = async (data: FormData) => {
    try {
      await apiFetchClient({
        method: "POST",
        endpoint: "/chamado",
        data,
      });
      reset();
      setUploadedFiles([]);
      router.push("/chamados");
    } catch (err) {
      console.error("Erro ao abrir chamado:", err);
    }
  };

  const onInvalid = (errors: FieldErrors<FormData>) => {
    console.log("Erros de validação:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="bg-[var(--primary)] p-6 rounded-lg space-y-4"
    >
      {/* Selects */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
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

        <div className="flex-1 min-w-[200px]">
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

        <div className="flex-1 min-w-[200px]">
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

        <div className="flex-1 min-w-[200px]">
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

      {/* Assunto */}
      <Controller
        name="assunto"
        control={control}
        render={({ field }) => (
          <InputText
            label="Assunto"
            labelColor="text-[var(--extra)]"
            name="assunto"
            value={field.value}
            onChange={(val) => field.onChange(val)}
            placeholder="Digite o assunto do chamado"
          />
        )}
      />
      {errors.assunto && (
        <p className="text-[var(--destructive)] text-sm">
          {errors.assunto.message}
        </p>
      )}

      {/* Mensagem */}
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

      {/* Arquivos */}
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
              file?.extension?.match(/(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
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
