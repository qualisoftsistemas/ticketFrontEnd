import { Pagination } from "./Pagination";

export interface Operador {
  id: number;

  nome: string;
  whatsapp?: string;
  email?: string;
  senha: string;
}

export interface OperadorApiResponse {
  status: {
    code: number;
    message: string;
  };
  operadores: Operador[];
  pagination: Pagination;
}
