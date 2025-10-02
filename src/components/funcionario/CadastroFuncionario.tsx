"use client";
import { useEffect } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Funcionario } from "@/types/Funcionario";
import { Button } from "../ui/button";
import InputText from "../ui/inputText";
import InputCPF from "../ui/inputCpf";

const schema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
  cpf: z.string().min(11, "CPF deve ter 11 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
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
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: initialData?.nome || "",
      senha: initialData?.senha || "",
      cpf: initialData?.cpf || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
    },
  });

  useEffect(() => {
    reset({
      id: initialData?.id,
      nome: initialData?.nome || "",
      senha: initialData?.senha || "",
      cpf: initialData?.cpf || "",
      email: initialData?.email || "",
      whatsapp: initialData?.whatsapp || "",
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
    });
  }, [initialData, reset]);

  const nomeValue = watch("nome");
  const senhaValue = watch("senha");
  const cpfValue = watch("cpf");
  const emailValue = watch("email");
  const whatsappValue = watch("whatsapp");
  const facebookValue = watch("facebook");
  const instagramValue = watch("instagram");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl text-[var(--primary-foreground)] mb-4">
        Cadastro de Funcionário
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
          onChange={(val) => setValue("senha", val, { shouldValidate: true })}
          placeholder="Digite a senha do funcionário"
        />
        {errors.senha && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.senha.message}
          </p>
        )}

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
          placeholder="Digite o WhatsApp"
        />
        {errors.whatsapp && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.whatsapp.message}
          </p>
        )}

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
        {errors.facebook && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.facebook.message}
          </p>
        )}

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
        {errors.instagram && (
          <p className="text-[var(--destructive)] text-sm">
            {errors.instagram.message}
          </p>
        )}

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
  );
}
