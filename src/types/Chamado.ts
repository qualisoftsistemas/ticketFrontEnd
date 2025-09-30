import { Pagination } from "./Pagination";
import { Funcionario } from "./Funcionario";
import { Empresa } from "./Empresa";
import { Setor } from "./Setor";
import { Categoria } from "./Categoria";
import { Operador } from "./Operador";
import { Admin } from "./Admin";

export interface Chamado {
  id: number;
  assunto: string;
  status: string;
  prioridade: string;
  solicitante: Funcionario | Admin;
  mensagens: Mensagem[];
  operador: Operador;
  empresa: Empresa;
  setor: Setor;
  categoria: Categoria;
  created_at: string;
  updated_at: string;
}

export interface Mensagem {
  anexos: [];
  data_envio: string;
  id: number;
  mensagem: string;
  ordenacao: number;
  reacoes: [];
  user: { id: number; foto: string; nome: string };
}

export interface ChamadoApiResponse {
  status: {
    code: number;
    message: string;
  };
  chamado: Chamado;
  pagination?: Pagination;
}
