import { Foto } from "./Foto";

export type Prestador = {
  id?: number;
  nome: string;
  ativo: number;
  foto_id?: number;
  foto?: Foto;
};
