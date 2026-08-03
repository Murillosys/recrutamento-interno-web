export interface Vaga {
  id?: number;
  titulo: string;
  descricao: string;
  requisitos: string;
  status: 'ABERTA' | 'ENCERRADA';
  dataCriacao?: string;
}