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
  const [openModalImage, setOpenModalImage] = useState(false);

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
    if (!fotoId) {
      showRequestToast("error", "Envie uma foto antes de salvar!");
      return;
    }

    const payload = {
      ...data,
      foto_id: fotoId,
    };

    onSubmit(payload);
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
          <div className="flex flex-col gap-3">
            <label className="text-[var(--extra)] font-medium">Foto</label>

            {/* Se já houver foto cadastrada */}
            {fotoUrl && (
              <div className="flex flex-col items-start gap-2">
                <img
                  src={fotoUrl}
                  alt="Foto do Prestador"
                  className="w-32 h-32 rounded-lg object-cover border border-[var(--border)]"
                />
                <Button
                  variant="default"
                  type="button"
                  onClick={() => setOpenModalImage(true)}
                >
                  Alterar Foto
                </Button>
              </div>
            )}

            {/* Caso ainda não tenha foto */}
            {!fotoUrl && (
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
        setId={(id) => {
          setFotoId(id);
          // Assim que enviar uma nova, remove a antiga da tela
          setFotoUrl(null);
        }}
      />
    </>
  );
}
