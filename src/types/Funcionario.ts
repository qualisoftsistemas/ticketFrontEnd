import { Pagination } from "./Pagination";

export interface Funcionario {
  id: number;
  nome: string;
  senha: string;
}

export interface FuncionarioApiResponse {
  status: {
    code: number;
    message: string;
  };
  funcionarios: Funcionario[];
  pagination: Pagination;
}
