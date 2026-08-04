import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vaga } from '../core/models/vaga.model';
import { AuthService } from './auth.service';
import { API_ENDPOINTS } from '../core/config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class VagaService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  listarTodas(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(API_ENDPOINTS.vagas.todas, this.getAuthHeaders());
  }

  listarAtivas(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(API_ENDPOINTS.vagas.ativas, this.getAuthHeaders());
  }

  buscarPorId(id: number): Observable<Vaga> {
    return this.http.get<Vaga>(API_ENDPOINTS.vagas.porId(id), this.getAuthHeaders());
  }

  criar(vaga: { titulo: string; descricao: string; requisitos: string }): Observable<Vaga> {
    return this.http.post<Vaga>(API_ENDPOINTS.vagas.ativas, vaga, this.getAuthHeaders());
  }

  atualizar(id: number, vaga: { titulo: string; descricao: string; requisitos: string }): Observable<Vaga> {
    return this.http.put<Vaga>(API_ENDPOINTS.vagas.porId(id), vaga, this.getAuthHeaders());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.vagas.porId(id), this.getAuthHeaders());
  }

  candidatar(vagaId: number): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.candidaturas.porVaga(vagaId), {}, this.getAuthHeaders());
  }
}