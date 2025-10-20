import { UploadedFile } from "@/components/ui/inputFile";
import { Categoria } from "./Categoria";

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  ativo: number;
}

export interface Rotina {
  id: number;
  nome: string;
  ativo: number;
  categoria: Categoria;
}

export interface User {
  id: number;
  nome: string;
}

/** Arquivo enviado na rotina */
export interface Arquivo {
  id: number;
  name: string;  
  url: string;
  arquivo?: UploadedFile;
}

/** Upload de um arquivo para uma rotina */
export interface Upload {
  id: number;
  empresa: Empresa;
  rotina: Rotina;
  arquivos: Arquivo[];
  user: User;
  mes: number;
  ano: number;
  status: string;
}
