import { Foto } from "./Foto";
import { Pagination } from "./Pagination";

export interface Admin {
  id: number;
  conglomerado: {
    id: number;
    nome: string;
    ativo: number;
  };
  ativo: number;
  conglomerado_id?: number;
  nome: string;
  senha: string;
  email?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  cpf?: string;
  foto_id?: number;
    foto: Foto;

}

export interface AdminApiResponse {
  status: {
    code: number;
    message: string;
  };
  admins: Admin[];
  pagination: Pagination;
 }
