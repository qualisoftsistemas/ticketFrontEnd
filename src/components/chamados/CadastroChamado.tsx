"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import { useUserRole } from "@/hooks/useUserRole";

const baseSchema = z.object({
  empresa_id: z.number().min(1, "Selecione uma empresa"),
  setor_id: z.number().min(1, "Selecione um setor"),
  categoria_id: z.number().min(1, "Selecione uma categoria"),
  assunto: z.string().min(3, "Assunto obrigatório"),
  mensagem: z.string().min(5, "Mensagem obrigatória"),
  arquivos_ids: z.array(z.number()).optional(),
  operador_id: z.number().optional(),
});

export interface SelectsData {
  setores: { id: number; nome: string }[];
  categorias: { id: number; nome: string }[];
  empresas: { id: number; nome: string }[];
  operadores: { id: number; nome: string; foto?: string | null }[];
}

type FormData = z.infer<typeof baseSchema>;

const CadastroChamado = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      arquivos_ids: [],
    },
  });

  const role = useUserRole();
  const router = useRouter();

  const [empresas, setEmpresas] = useState<SelectsData["empresas"]>([]);
  const [setores, setSetores] = useState<SelectsData["setores"]>([]);
  const [categorias, setCategorias] = useState<SelectsData["categorias"]>([]);
  const [operadores, setOperadores] = useState<SelectsData["operadores"]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  useEffect(() => {
    const fetchSelectsData = async () => {
      try {
        const data = await apiFetchClient<SelectsData>({
          method: "GET",
          endpoint: "/abrir_chamado/selects_iniciais",
        });

        setEmpresas(data.empresas || []);
        setSetores(data.setores || []);

        // 🔹 Seleciona a empresa padrão do localStorage, se existir
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("empresa-store");
          console.log("saved", saved);
          if (saved) {
            try {
              const parsed = JSON.parse(saved) as any;
              const savedEmpresaId = parsed?.state?.empresaSelecionada?.id;
              if (savedEmpresaId) {
                const empresaExistente = data.empresas.find(
                  (e) => e.id === savedEmpresaId
                );
                if (empresaExistente) {
                  setValue("empresa_id", empresaExistente.id, {
                    shouldValidate: true,
                  });
                }
              }
            } catch (e) {
              console.error("Erro ao ler empresa do localStorage", e);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar selects:", err);
      }
    };

    fetchSelectsData();
  }, [setValue]);

  useEffect(() => {
    let savedEmpresaId: number | undefined;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("empresa-store");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { id: number };
          savedEmpresaId = parsed.id;
        } catch (e) {
          console.error("Erro ao ler empresa do localStorage", e);
        }
      }
    }

    if (savedEmpresaId) {
      setValue("empresa_id", savedEmpresaId, { shouldValidate: true });
    }
  }, [setValue]);

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
      // Remove operador_id se não aplicável
      let payload: FormData = data;
      if (role === "Master" || role === "Operador") {
        const { operador_id, ...rest } = data;
        payload = rest as FormData;
      }

      await apiFetchClient({
        method: "POST",
        endpoint: "/chamado",
        data: payload,
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
            render={({ field }) => {
              const selectedOption =
                empresasOptions.find((opt) => opt.id === field.value) || null;

              return (
                <Select
                  label="Empresa"
                  options={empresasOptions}
                  placeholder="Selecione a empresa"
                  selectedOption={selectedOption} // <-- aqui mostra a label corretamente
                  onSelect={(option) => field.onChange(Number(option.id))}
                />
              );
            }}
          />

          {errors.empresa_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.empresa_id.message}
            </p>
          )}
        </div>

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
              onSelect={async (option) => {
                const setorId = Number(option.id);
                field.onChange(setorId);

                try {
                  const data = await apiFetchClient<{
                    categorias: { id: number; nome: string }[];
                    operadores: {
                      id: number;
                      nome: string;
                      foto?: string | null;
                    }[];
                  }>({
                    method: "GET",
                    endpoint: `/abrir_chamado/detalhes_setor/${setorId}`,
                  });

                  setCategorias(data.categorias || []);
                  setOperadores(data.operadores || []);

                  setValue("categoria_id", 0);
                  if (role === "Funcionario" || role === "Admin") {
                    setValue("operador_id", 0);
                  }
                } catch (err) {
                  console.error("Erro ao buscar detalhes do setor:", err);
                }
              }}
            />
          )}
        />

        <div className="flex-1 min-w-[200px]">
          <Controller
            name="categoria_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoria"
                options={categoriaOptions}
                placeholder="Selecione a categoria"
                disabled={categorias.length === 0}
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

        {(role === "Funcionario" || role === "Admin") && (
          <div className="flex-1 min-w-[200px]">
            <Controller
              name="operador_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Operador"
                  options={operadorOptions}
                  placeholder="Selecione o operador"
                  disabled={operadores.length === 0}
                  selectedOption={
                    operadorOptions.find((opt) => opt.id === field.value) ||
                    null
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
        )}
      </div>

      {/* Assunto */}
      <Controller
        name="assunto"
        control={control}
        render={({ field }) => (
          <InputText
            label="Assunto"
            labelColor="text-[var(--extra)]"
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
                <Image src="/icons/Eye.svg" alt="Eye" width={24} height={24} />
              ) : (
                <Image
                  src="/icons/Download.svg"
                  alt="Download"
                  width={24}
                  height={24}
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
