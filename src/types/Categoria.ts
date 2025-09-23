import { Pagination } from "./Pagination";

export interface Categoria {
  id: number;
  nome: string;
  ativo: number;
  setor_id: number;
  setor: {
    id: number;
    nome: string;
    ativo: number;
  };
}

export interface CategoriaApiResponse {
  status: {
    code: number;
    message: string;
  };
  categorias: Categoria[];
  pagination: Pagination;
}
