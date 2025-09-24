import { Pagination } from "./Pagination";

export interface Empresa {
  id: number;
  conglomerado: {
    id: number;
    nome: string;
    ativo: number;
  };
  conglomerado_id?: number;
  nome: string;
  cnpj: string;
  ativo: number;
}

export interface EmpresaApiResponse {
  status: {
    code: number;
    message: string;
  };
  empresas: Empresa[];
  pagination: Pagination;
}
