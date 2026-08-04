import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VagaService } from '../../services/vaga.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Vaga } from '../../core/models/vaga.model';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vagas.component.html',
  styleUrls: ['./vagas.component.scss']
})
export class VagasComponent implements OnInit {
  vagas: Vaga[] = [];
  vagasFiltradas: Vaga[] = [];
  candidaturasUsuario: number[] = [];
  
  vagaForm: FormGroup;
  isAdmin: boolean = false;
  userName: string = '';
  loading: boolean = false;

  mostrarModalForm: boolean = false;
  mostrarModalEncerrar: boolean = false;
  mostrarModalSucesso: boolean = false;
  
  modoEdicao: boolean = false;
  vagaEmEdicaoId: number | null = null;
  vagaParaEncerrarId: number | null = null;

  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vagaService: VagaService,
    private authService: AuthService,
    private http: HttpClient,
    public router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.vagaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      requisitos: ['', Validators.required]
    });
  }

  private getAuthOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.userName = this.authService.getNome();
    this.carregarVagas();
    if (this.authService.isLoggedIn()) {
      this.carregarMinhasCandidaturas();
    }
  }

  carregarMinhasCandidaturas(): void {
    const token = this.authService.getToken();
    if (!token) return;
    this.http.get<any[]>('http://localhost:8080/candidaturas/minhas', this.getAuthOptions()).subscribe({
      next: (candidaturas) => {
        if (candidaturas && Array.isArray(candidaturas)) {
          this.candidaturasUsuario = candidaturas.map(c => c.vagaId);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar minhas candidaturas:', err);
      }
    });
  }

  carregarVagas(): void {
    this.loading = true;

    const request$: Observable<Vaga[]> = this.isAdmin 
      ? this.vagaService.listarTodas() 
      : this.vagaService.listarAtivas();

    request$.subscribe({
      next: (data: Vaga[]) => {
        this.vagas = data;
        this.vagasFiltradas = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar vagas:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const termo = input.value.toLowerCase();
    
    this.vagasFiltradas = this.vagas.filter(vaga => 
      vaga.titulo.toLowerCase().includes(termo) || 
      vaga.requisitos.toLowerCase().includes(termo)
    );
  }

  abrirModalCriacao(): void {
    this.modoEdicao = false;
    this.vagaEmEdicaoId = null;
    this.vagaForm.reset();
    this.mostrarModalForm = true;
    this.cdr.detectChanges();
  }

  abrirModalEdicao(vaga: Vaga): void {
    if (!vaga.id || vaga.status === 'ENCERRADA') return;
    
    this.modoEdicao = true;
    this.vagaEmEdicaoId = vaga.id;
    this.vagaForm.patchValue({
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      requisitos: vaga.requisitos
    });
    this.mostrarModalForm = true;
    this.cdr.detectChanges();
  }

  salvarVaga(): void {
    if (this.vagaForm.invalid) {
      this.vagaForm.markAllAsTouched();
      return;
    }

    const { titulo, descricao, requisitos } = this.vagaForm.value;
    const payload = { titulo, descricao, requisitos };

    if (this.modoEdicao && this.vagaEmEdicaoId) {
      this.vagaService.atualizar(this.vagaEmEdicaoId, payload).subscribe({
        next: () => {
          this.fecharModalForm();
          this.carregarVagas();
        },
        error: (err: any) => console.error('Erro ao atualizar vaga:', err)
      });
    } else {
      this.vagaService.criar(payload).subscribe({
        next: () => {
          this.fecharModalForm();
          this.carregarVagas();
        },
        error: (err: any) => console.error('Erro ao criar vaga:', err)
      });
    }
  }

  fecharModalForm(): void {
    this.mostrarModalForm = false;
    this.vagaForm.reset();
    this.cdr.detectChanges();
  }

  abrirModalEncerrar(vagaId: number | undefined): void {
    if (!vagaId) return;
    this.vagaParaEncerrarId = vagaId;
    this.mostrarModalEncerrar = true;
    this.cdr.detectChanges();
  }

  confirmarEncerramento(): void {
    if (this.vagaParaEncerrarId) {
      this.vagaService.excluir(this.vagaParaEncerrarId).subscribe({
        next: () => {
          this.fecharModalEncerrar();
          this.carregarVagas();
        },
        error: (err: any) => {
          console.error('Erro ao encerrar vaga:', err);
          this.fecharModalEncerrar();
        }
      });
    }
  }

  fecharModalEncerrar(): void {
    this.mostrarModalEncerrar = false;
    this.vagaParaEncerrarId = null;
    this.cdr.detectChanges();
  }

  jaCandidatado(vagaId: number | undefined): boolean {
    if (!vagaId) return false;
    return this.candidaturasUsuario.includes(vagaId);
  }

  candidatar(vagaId: number | undefined): void {
    if (!vagaId) return;

    this.vagaService.candidatar(vagaId).subscribe({
      next: () => {
        if (!this.candidaturasUsuario.includes(vagaId)) {
          this.candidaturasUsuario.push(vagaId);
        }
        this.mostrarModalSucesso = true;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erro ao candidatar-se:', err)
    });
  }

  fecharModalSucesso(): void {
    this.mostrarModalSucesso = false;
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}