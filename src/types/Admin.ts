import { Pagination } from "./Pagination";

export interface Admin {
  id: number;
  conglomerado: {
    id: number;
    nome: string;
    ativo: number;
  };
  conglomerado_id?: number;
  nome: string;
  senha: string;
}

export interface AdminApiResponse {
  status: {
    code: number;
    message: string;
  };
  admins: Admin[];
  pagination: Pagination;
}
