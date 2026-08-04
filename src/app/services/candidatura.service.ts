import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidatura } from '../core/models/candidatura.model';
import { API_ENDPOINTS } from '../core/config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CandidaturaService {
  constructor(private http: HttpClient) {}

  listarMinhasCandidaturas(): Observable<Candidatura[]> {
    return this.http.get<Candidatura[]>(API_ENDPOINTS.candidaturas.minhas);
  }

  listarPorVaga(vagaId: number): Observable<Candidatura[]> {
    return this.http.get<Candidatura[]>(API_ENDPOINTS.candidaturas.porVaga(vagaId));
  }

  avaliarCandidato(
    candidaturaId: number,
    dados: { status: string; feedback?: string; notaAvaliacao?: number }
  ): Observable<Candidatura> {
    return this.http.patch<Candidatura>(API_ENDPOINTS.candidaturas.avaliar(candidaturaId), dados);
  }

  atualizarStatusEFeedback(
    candidaturaId: number, 
    dados: { status: string; feedback?: string; notaAvaliacao?: number }
  ): Observable<Candidatura> {
    return this.avaliarCandidato(candidaturaId, dados);
  }
}