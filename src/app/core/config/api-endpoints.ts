import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`
  },
  vagas: {
    ativas: `${BASE_URL}/vagas`,
    todas: `${BASE_URL}/vagas/todas`,
    porId: (id: number) => `${BASE_URL}/vagas/${id}`
  },
  candidaturas: {
    minhas: `${BASE_URL}/candidaturas/minhas`,
    porVaga: (vagaId: number) => `${BASE_URL}/candidaturas/vagas/${vagaId}`,
    avaliar: (candidaturaId: number) => `${BASE_URL}/candidaturas/${candidaturaId}/avaliar`
  }
};
