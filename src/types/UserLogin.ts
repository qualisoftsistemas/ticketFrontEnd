export type UserLogin = {
  ativo: 1;
  cpf: null;
  created_at: string;
  email: null;
  facebook: null;
  id: number;
  instagram: null;
  nome: string;
  prestador: {
    ativo: 1;
    created_at: string;
    id: number;
    nome: string;
    prestador_id: number;
    tipo: string;
    updated_at: string;
  };
  foto: {
    id: number;
    url: string;
  };
  prestador_id: number;
  tipo: string;
  updated_at: string;
  whatsapp: null;
};
