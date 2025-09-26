import { Pagination } from "./Pagination";

export interface Conglomerado {
  id: number;
  nome: string;
  ativo: number;
}

export interface ConglomeradoApiResponse {
  status: {
    code: number;
    message: string;
  };
  conglomerados: Conglomerado[];
  pagination: Pagination;
}
