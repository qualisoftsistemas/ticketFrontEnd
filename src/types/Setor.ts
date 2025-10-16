import { Pagination } from "./Pagination";

export interface Setor {
  id: number;
  nome: string;
  ativo: number;
  incremental: number;
}

export interface SetorApiResponse {
  status: {
    code: number;
    message: string;
  };
  setores: Setor[];
  pagination: Pagination;
}
