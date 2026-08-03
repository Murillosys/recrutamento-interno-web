import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },

  { 
    path: 'vagas', 
    loadComponent: () => import('./pages/vagas/vagas.component').then(m => m.VagasComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'painel-candidato', 
    loadComponent: () => import('./pages/painel-candidato/painel-candidato.component').then(m => m.PainelCandidatoComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_CANDIDATO' }
  },
  { 
    path: 'gestao-candidatos', 
    loadComponent: () => import('./pages/gestao-candidatos/gestao-candidatos.component').then(m => m.GestaoCandidatosComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ROLE_ADMIN' }
  },

  { path: '**', redirectTo: 'login' }
];