"use client";
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Funcionario } from "@/types/Funcionario";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import InputCPF from "../ui/inputCpf";
import ModalImage from "../ui/modalImage";
import { showRequestToast } from "../ui/toast";

// 🔹 Schema com validação condicional
const schema = z
  .object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    senha: z.string().optional(),
    cpf: z.string().optional(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.senha) {
      ctx.addIssue({
        path: ["senha"],
        message: "Senha é obrigatória ao criar um funcionário",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Funcionario>) => void;
  initialData?: Funcionario | null;
}

export default function CadastroFuncionario({
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
      cpf: initialData?.cpf || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
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
      cpf: initialData?.cpf || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
    });
    setFotoId(initialData?.foto_id || null);
  }, [initialData, reset]);

  const nomeValue = watch("nome");
  const senhaValue = watch("senha");
  const cpfValue = watch("cpf");
  const emailValue = watch("email");
  const whatsappValue = watch("whatsapp");
  const facebookValue = watch("facebook");
  const instagramValue = watch("instagram");

  const handleFormSubmit = (data: FormData) => {
    if (!fotoId) {
      showRequestToast("error", "Envie uma foto antes de salvar!");
      return;
    }

    const payload = { ...data, foto_id: fotoId };

    if (initialData?.id && !data.senha) {
      delete payload.senha; // 🔸 Remove senha se for edição e estiver vazia
    }

    onSubmit(payload);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
          {initialData ? "Editar Funcionário" : "Cadastrar Funcionário"}
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
            placeholder="Digite o nome do funcionário"
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
                : "Digite a senha do funcionário"
            }
          />
          {errors.senha && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.senha.message}
            </p>
          )}

          {/* CPF */}
          <InputCPF
            label="CPF"
            value={cpfValue}
            onChange={(val) => setValue("cpf", val, { shouldValidate: true })}
            placeholder="Digite o CPF"
          />
          {errors.cpf && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.cpf.message}
            </p>
          )}

          {/* Email */}
          <InputText
            label="Email"
            labelColor="text-[var(--extra)]"
            value={emailValue}
            onChange={(val) => setValue("email", val, { shouldValidate: true })}
            placeholder="Digite o email"
          />
          {errors.email && (
            <p className="text-[var(--destructive)] text-sm">
              {errors.email.message}
            </p>
          )}

          {/* WhatsApp */}
          <InputText
            label="WhatsApp"
            labelColor="text-[var(--extra)]"
            value={whatsappValue}
            onChange={(val) =>
              setValue("whatsapp", val, { shouldValidate: true })
            }
            placeholder="Digite o número do WhatsApp"
          />

          {/* Facebook */}
          <InputText
            label="Facebook"
            labelColor="text-[var(--extra)]"
            value={facebookValue}
            onChange={(val) =>
              setValue("facebook", val, { shouldValidate: true })
            }
            placeholder="Digite o perfil do Facebook"
          />

          {/* Instagram */}
          <InputText
            label="Instagram"
            labelColor="text-[var(--extra)]"
            value={instagramValue}
            onChange={(val) =>
              setValue("instagram", val, { shouldValidate: true })
            }
            placeholder="Digite o perfil do Instagram"
          />

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

          {/* Botões */}
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
      <ModalImage
        open={openModalImage}
        onClose={() => setOpenModalImage(false)}
        onConfirm={() => {}}
        setId={(id) => setFotoId(id)}
      />
    </>
  );
}
