import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  type?: string;
  name?: string;
  email?: string;
  perfil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; senha: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res && res.token) {
          localStorage.setItem('auth_token', res.token);
          if (res.name) localStorage.setItem('user_name', res.name);
          if (res.perfil) localStorage.setItem('user_perfil', res.perfil);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_perfil');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  getUserName(): string {
    return localStorage.getItem('user_name') || 'Usuário';
  }

  getNome(): string {
    return this.getUserName();
  }

  getUserPerfil(): string {
    return localStorage.getItem('user_perfil') || '';
  }

  getPerfil(): string {
    return this.getUserPerfil();
  }

  isAdmin(): boolean {
    const perfil = this.getPerfil().toUpperCase();
    return perfil === 'ADMIN' || perfil === 'RH' || perfil === 'RECRUTADOR' || perfil === 'ROLE_ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}