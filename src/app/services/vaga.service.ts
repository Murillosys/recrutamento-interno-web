import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vaga } from '../core/models/vaga.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class VagaService {
  private apiUrl = 'http://localhost:8080/vagas';

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
    return this.http.get<Vaga[]>(`${this.apiUrl}/todas`, this.getAuthHeaders());
  }

  listarAtivas(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(this.apiUrl, this.getAuthHeaders());
  }

  buscarPorId(id: number): Observable<Vaga> {
    return this.http.get<Vaga>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  criar(vaga: { titulo: string; descricao: string; requisitos: string }): Observable<Vaga> {
    return this.http.post<Vaga>(this.apiUrl, vaga, this.getAuthHeaders());
  }

  atualizar(id: number, vaga: { titulo: string; descricao: string; requisitos: string }): Observable<Vaga> {
    return this.http.put<Vaga>(`${this.apiUrl}/${id}`, vaga, this.getAuthHeaders());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  candidatar(vagaId: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/candidaturas/vagas/${vagaId}`, {}, this.getAuthHeaders());
  }
}