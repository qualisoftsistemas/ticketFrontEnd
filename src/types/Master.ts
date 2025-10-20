import { Foto } from "./Foto";
import { Pagination } from "./Pagination";
import { Setor } from "./Setor";

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
  setores: Setor[];
  foto_id?: number;
  foto?: Foto;
  master: Master;
}

export interface MasterApiResponse {
  status: {
    code: number;
    message: string;
  };
  master: Master[];
  pagination: Pagination;
  
}
