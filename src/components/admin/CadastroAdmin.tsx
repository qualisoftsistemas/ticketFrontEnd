"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Admin } from "@/types/Admin";
import { Button } from "../ui/button";
import { useConglomeradoStore } from "@/store/conglomeradoStore";
import InputText from "../ui/inputText";
import Select, { SelectOption } from "../ui/select";
import ModalImage from "../ui/modalImage";
import { showRequestToast } from "../ui/toast";

// 🔹 Schema: senha obrigatória só ao criar
const schema = z
  .object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string(),
    conglomerado_id: z.number().min(1, "Conglomerado é obrigatório"),
    senha: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.senha) {
      ctx.addIssue({
        path: ["senha"],
        message: "Senha é obrigatória ao criar um admin",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Admin>) => void;
  initialData?: Admin | null;
}

export default function ModalCadastroAdmin({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const { conglomerados, fetchConglomerados, conglomeradoSelecionado } =
    useConglomeradoStore();

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData?.id,
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      conglomerado_id:
        initialData?.conglomerado?.id ||
        conglomeradoSelecionado?.id ||
        undefined,
      senha: "",
    },
  });

  const [fotoId, setFotoId] = useState<number | null>(
    initialData?.foto_id || null
  );
  const [openModalImage, setOpenModalImage] = useState(false);

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      conglomerado_id:
        initialData?.conglomerado?.id ||
        conglomeradoSelecionado?.id ||
        undefined,
      senha: "",
    });
    setFotoId(initialData?.foto_id || null);
  }, [initialData, reset, conglomeradoSelecionado]);

  useEffect(() => {
    // pega conglomerado do localStorage se não houver inicialData
    let savedConglomeradoId: number | undefined = conglomeradoSelecionado?.id;

    if (!initialData?.conglomerado?.id && typeof window !== "undefined") {
      const saved = localStorage.getItem("conglomeradoSelecionado");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { id: number };
          savedConglomeradoId = parsed.id;
        } catch (e) {
          console.error("Erro ao ler conglomerado do localStorage", e);
        }
      }
    }

    fetchConglomerados().then(() => {
      if (!initialData?.conglomerado?.id && savedConglomeradoId) {
        setValue("conglomerado_id", savedConglomeradoId, {
          shouldValidate: true,
        });
      }
    });
  }, [fetchConglomerados, initialData, setValue, conglomeradoSelecionado]);

  const conglomeradoOptions: SelectOption[] = conglomerados.map((c) => ({
    id: c.id,
    label: c.nome,
  }));

  const nomeValue = watch("nome");
  const emailValue = watch("email");
  const senhaValue = watch("senha");

  const handleFormSubmit = (data: FormData) => {
    if (!fotoId) {
      showRequestToast("error", "Envie uma foto antes de salvar!");
      return;
    }

    const payload = { ...data, foto_id: fotoId };

    if (initialData?.id && !data.senha) {
      delete payload.senha;
    }

    onSubmit(payload);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
          {initialData ? "Editar Admin" : "Cadastrar Admin"}
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
            placeholder="Digite o nome do admin"
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
                : "Digite a senha do admin"
            }
          />
          {errors.senha && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.senha.message}
            </p>
          )}

          {/* Email */}
          <InputText
            label="Email"
            labelColor="text-[var(--extra)]"
            value={emailValue}
            onChange={(val) => setValue("email", val, { shouldValidate: true })}
            placeholder="Digite o email do admin"
          />
          {errors.email && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.email.message}
            </p>
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
                  onSelect={(option) => {
                    field.onChange(Number(option.id));
                  }}
                />
              );
            }}
          />
          {errors.conglomerado_id && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.conglomerado_id.message}
            </p>
          )}

          {/* Foto */}
          <div className="flex flex-col gap-2">
            <label className="text-[var(--extra)] font-medium">Foto</label>

            {fotoId && initialData?.foto?.url ? (
              <div className="flex items-center gap-3">
                <img
                  src={initialData.foto.url}
                  alt="Foto atual"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <Button
                  variant="default"
                  type="button"
                  onClick={() => setOpenModalImage(true)}
                >
                  Alterar
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                type="button"
                onClick={() => setOpenModalImage(true)}
              >
                Enviar Foto
              </Button>
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

      {/* Modal para envio de imagem */}
      <ModalImage
        open={openModalImage}
        onClose={() => setOpenModalImage(false)}
        onConfirm={() => {}}
        setId={(id) => setFotoId(id)}
      />
    </>
  );
}
