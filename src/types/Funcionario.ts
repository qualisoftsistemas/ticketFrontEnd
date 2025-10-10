import { Pagination } from "./Pagination";

export interface Funcionario {
  id: number;
  nome: string;
  senha: string;
  ativo: number;
  email?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  cpf?: string;
}

export interface FuncionarioApiResponse {
  status: {
    code: number;
    message: string;
  };
  funcionarios: Funcionario[];
  pagination: Pagination;
}
