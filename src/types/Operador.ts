import { Foto } from "./Foto";
import { Pagination } from "./Pagination";
import { Setor } from "./Setor";

export interface Operador {
  id: number;
  ativo: number;
  nome: string;
  whatsapp?: string;
  email?: string;
  senha: string;
  setores: Setor[];
  foto_id?: number;
  foto?: Foto;
}

export interface OperadorApiResponse {
  status: {
    code: number;
    message: string;
  };
  operadores: Operador[];
  pagination: Pagination;
}
