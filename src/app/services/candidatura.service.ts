import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidatura } from '../core/models/candidatura.model';

@Injectable({
  providedIn: 'root'
})
export class CandidaturaService {
  private apiUrl = 'http://localhost:8080/candidaturas';

  constructor(private http: HttpClient) {}

  listarMinhasCandidaturas(): Observable<Candidatura[]> {
    return this.http.get<Candidatura[]>(`${this.apiUrl}/minhas`);
  }

  listarPorVaga(vagaId: number): Observable<Candidatura[]> {
    return this.http.get<Candidatura[]>(`${this.apiUrl}/vagas/${vagaId}`);
  }

  avaliarCandidato(
    candidaturaId: number, 
    dados: { status: string; feedback?: string; notaAvaliacao?: number }
  ): Observable<Candidatura> {
    return this.http.patch<Candidatura>(`${this.apiUrl}/${candidaturaId}/avaliar`, dados);
  }

  atualizarStatusEFeedback(
    candidaturaId: number, 
    dados: { status: string; feedback?: string; notaAvaliacao?: number }
  ): Observable<Candidatura> {
    return this.avaliarCandidato(candidaturaId, dados);
  }
}