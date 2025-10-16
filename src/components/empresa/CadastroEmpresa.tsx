"use client";
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Empresa } from "@/types/Empresa";
import { useConglomeradoStore } from "@/store/conglomeradoStore";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "@/components/ui/select";
import InputCNPJ from "../ui/inputCnpj";
import ModalImage from "../ui/modalImage";
import { showRequestToast } from "../ui/toast";
import InputFile, { UploadedFile } from "../ui/inputFile";
import FileBadge from "../ui/fileBadge";

const schema = z.object({
  id: z.number().optional(),
  conglomerado_id: z.number().min(1, "Conglomerado é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(14, "CNPJ é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Empresa>) => void;
  initialData?: Empresa | null;
}

export default function CadastroEmpresa({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const { conglomerados, fetchConglomerados, conglomeradoSelecionado } =
    useConglomeradoStore();

  const [fotoId, setFotoId] = useState<number | null>(
    initialData?.foto_id || null
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fotoAtual, setFotoAtual] = useState<string | null>(
    initialData?.foto?.url || null
  );
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
      cnpj: initialData?.cnpj || "",
      conglomerado_id:
        initialData?.conglomerado_id ||
        conglomeradoSelecionado?.id ||
        undefined,
    },
  });

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
      cnpj: initialData?.cnpj || "",
      conglomerado_id:
        initialData?.conglomerado_id ||
        conglomeradoSelecionado?.id ||
        undefined,
    });
    setFotoId(initialData?.foto_id || null);
  }, [initialData, conglomeradoSelecionado, reset]);

  useEffect(() => {
    fetchConglomerados();
  }, [fetchConglomerados]);

  const conglomeradoOptions: SelectOption[] = conglomerados.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  const conglomeradoIdValue = watch("conglomerado_id");
  const nomeValue = watch("nome");
  const cnpjValue = watch("cnpj");

  const handleSave = (data: FormData) => {
    const payload = {
      ...data,
      foto_id: fotoId,
    };

    onSubmit(payload as Partial<Empresa>);
  };
  useEffect(() => {
    setFotoAtual(initialData?.foto?.url || null);
  }, [initialData]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
          {initialData ? "Editar Empresa" : "Cadastrar Empresa"}
        </h2>

        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex flex-col gap-6"
        >
          {initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          {/* Conglomerado */}
          <Controller
            name="conglomerado_id"
            control={control}
            render={({ field }) => {
              const selectedOption =
                conglomeradoOptions.find((opt) => opt.id === field.value) ||
                null;

              return (
                <Select
                  label="Conglomerado"
                  options={conglomeradoOptions}
                  placeholder="Selecione o conglomerado"
                  selectedOption={selectedOption}
                  onSelect={(option) => field.onChange(Number(option.id))}
                />
              );
            }}
          />
          {errors.conglomerado_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.conglomerado_id.message}
            </p>
          )}

          {/* Nome */}
          <InputText
            label="Nome"
            labelColor="text-[var(--extra)]"
            value={nomeValue}
            onChange={(val) => setValue("nome", val, { shouldValidate: true })}
            placeholder="Digite o nome da empresa"
          />
          {errors.nome && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.nome.message}
            </p>
          )}

          {/* CNPJ */}
          <InputCNPJ
            label="CNPJ"
            value={cnpjValue}
            onChange={(val) => setValue("cnpj", val, { shouldValidate: true })}
            placeholder="Digite o CNPJ"
          />
          {errors.cnpj && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.cnpj.message}
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

      {/* Modal de envio de imagem */}
    </>
  );
}
