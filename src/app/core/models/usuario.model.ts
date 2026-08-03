export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  name: string;
  perfil: 'ROLE_ADMIN' | 'ROLE_CANDIDATO';
}