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
}

export interface User {
  id: number;
  nome: string;
}

/** Arquivo enviado na rotina */
export interface Arquivo {
  id: number;
  name: string; // ⚠️ corresponde ao JSON do backend
  url: string;
}

/** Upload de um arquivo para uma rotina */
export interface Upload {
  id: number;
  empresa: Empresa;
  rotina: Rotina;
  arquivo: Arquivo;
  user: User;
  mes: number;
  ano: number;
  status: string;
}
