export interface Candidatura {
  id: number;
  vagaId: number;
  vagaTitulo: string;
  candidatoNome: string;
  candidatoEmail?: string;
  status: 'RECEBIDA' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO';
  feedback?: string;
  notaAvaliacao?: number;
  dataAplicacao: string;
}