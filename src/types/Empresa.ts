import { Foto } from "./Foto";
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
  foto_id?: number;
   foto: Foto;
}

export interface EmpresaApiResponse {
  status: {
    code: number;
    message: string;
  };
  empresas: Empresa[];
  pagination: Pagination;
 }
