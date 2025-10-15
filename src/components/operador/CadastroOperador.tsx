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
  const [openModalImage, setOpenModalImage] = useState(false);

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
    if (!fotoId) {
      showRequestToast("error", "Envie uma foto antes de salvar!");
      return;
    }

    const payload: Partial<Operador> = {
      ...data,
      foto_id: fotoId,
    };

    // Remove senha se for edição e campo estiver vazio
    if (initialData?.id && !data.senha) {
      delete payload.senha;
    }

    onSubmit(payload);
  };

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
          <div className="flex flex-col gap-2">
            <label className="text-[var(--extra)] font-medium">Foto</label>

            {initialData?.foto?.url && !openModalImage ? (
              <div className="flex items-center gap-3">
                <img
                  src={initialData.foto.url}
                  alt="Foto do operador"
                  className="w-16 h-16 object-cover rounded-full border"
                />
                <Button
                  variant="default"
                  type="button"
                  onClick={() => setOpenModalImage(true)}
                >
                  Alterar
                </Button>
              </div>
            ) : fotoId ? (
              <div className="flex items-center gap-3">
                <span className="text-[var(--success)]">📷 Foto enviada</span>
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

      {/* Modal de upload de imagem */}
      <ModalImage
        open={openModalImage}
        onClose={() => setOpenModalImage(false)}
        onConfirm={() => {}}
        setId={(id) => setFotoId(id)}
      />
    </>
  );
}
