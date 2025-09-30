import { Pagination } from "./Pagination";

export interface Master {
  id: number;
  nome: string;
  ativo: number;
  prestador_id: number;
  senha: string;
  prestador: {
    id: number;
    nome: string;
    ativo: number;
  };
}

export interface MasterApiResponse {
  status: {
    code: number;
    message: string;
  };
  master: Master[];
  pagination: Pagination;
}
