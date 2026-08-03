import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CandidaturaService } from '../../services/candidatura.service';
import { VagaService } from '../../services/vaga.service';
import { AuthService } from '../../services/auth.service';
import { Candidatura } from '../../core/models/candidatura.model';
import { Vaga } from '../../core/models/vaga.model';
import { ThemeService } from '../../core/services/theme.service';

export interface VagaComCandidatos {
  vaga: Vaga;
  candidaturas: Candidatura[];
}

@Component({
  selector: 'app-gestao-candidatos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestao-candidatos.component.html',
  styleUrls: ['./gestao-candidatos.component.scss']
})
export class GestaoCandidatosComponent implements OnInit {
  vagas: Vaga[] = [];
  vagaSelecionadaId: number | null = null;
  vagasAgrupadas: VagaComCandidatos[] = [];

  filtroCandidatoText: string = '';
  filtroStatusSelecionado: string = 'TODOS';

  loading = false;
  mostrarModalAvaliacao = false;
  mostrarDialogErroNota = false;
  candidaturaEmEdicao: Candidatura | null = null;

  avaliacaoForm: FormGroup;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;
  userName: string | null = '';

  constructor(
    public themeService: ThemeService,
    private candidaturaService: CandidaturaService,
    private vagaService: VagaService,
    private authService: AuthService,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.avaliacaoForm = this.fb.group({
      status: ['EM_ANALISE', Validators.required],
      notaAvaliacao: [null, [Validators.min(1), Validators.max(10)]],
      feedback: ['']
    });
  }

  ngOnInit(): void {
    this.userName = this.authService.getNome();
    this.carregarVagasEIniciar();
  }

  carregarVagasEIniciar(): void {
    this.vagaService.listarTodas().subscribe({
      next: (vagas) => {
        this.vagas = vagas;
        this.cdr.detectChanges();

        const idDaUrl = this.route.snapshot.queryParams['vagaId'];

        if (idDaUrl) {
          this.vagaSelecionadaId = Number(idDaUrl);
          this.buscarCandidatosDaVaga(this.vagaSelecionadaId);
        } else {
          this.buscarTodasAsCandidaturas();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar vagas:', err);
        this.mensagemErro = 'Erro ao carregar lista de vagas.';
        this.cdr.detectChanges();
      }
    });
  }

  selecionarVaga(valor: any): void {
    if (valor === 'null' || valor === null || valor === undefined || valor === '' || valor === 'undefined') {
      this.limparFiltroVaga();
    } else {
      this.vagaSelecionadaId = Number(valor);
      this.buscarCandidatosDaVaga(this.vagaSelecionadaId);
    }
  }

  limparFiltroVaga(): void {
    this.vagaSelecionadaId = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { vagaId: null },
      queryParamsHandling: 'merge'
    });
    this.buscarTodasAsCandidaturas();
  }

  limparTodosFiltros(): void {
    this.filtroCandidatoText = '';
    this.filtroStatusSelecionado = 'TODOS';
    this.vagaSelecionadaId = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { vagaId: null },
      queryParamsHandling: 'merge'
    });
    this.buscarTodasAsCandidaturas();
  }

  buscarCandidatosDaVaga(vagaId: number): void {
    if (!vagaId || isNaN(vagaId)) {
      this.buscarTodasAsCandidaturas();
      return;
    }

    this.loading = true;
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    const vagaObj = this.vagas.find(v => v.id == vagaId);

    this.candidaturaService.listarPorVaga(vagaId).subscribe({
      next: (candidaturas: Candidatura[]) => {
        if (vagaObj) {
          this.vagasAgrupadas = [{ vaga: vagaObj, candidaturas }];
        } else {
          this.vagasAgrupadas = [{
            vaga: { id: vagaId, titulo: `Vaga #${vagaId}`, descricao: '', requisitos: '', status: 'ABERTA' },
            candidaturas
          }];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar candidatos:', err);
        this.vagasAgrupadas = [];
        this.mensagemErro = 'Erro ao carregar candidatos desta vaga.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarTodasAsCandidaturas(): void {
    this.loading = true;
    this.mensagemSucesso = null;
    this.mensagemErro = null;
    if (!this.vagas || this.vagas.length === 0) {
      this.vagasAgrupadas = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    const chamadas = this.vagas.filter(v => v.id !== undefined).map(v => this.candidaturaService.listarPorVaga(v.id!));
    if (chamadas.length === 0) {
      this.vagasAgrupadas = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    forkJoin(chamadas).subscribe({
      next: (resultados: Candidatura[][]) => {
        this.vagasAgrupadas = this.vagas
          .filter(v => v.id !== undefined)
          .map((vaga, index) => ({
            vaga,
            candidaturas: resultados[index] || []
          }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar todas as candidaturas:', err);
        this.vagasAgrupadas = [];
        this.mensagemErro = 'Erro ao carregar lista geral de candidaturas.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarCandidaturasDaVaga(candidaturas: Candidatura[]): Candidatura[] {
    return candidaturas.filter(c => {
      const bateTexto = !this.filtroCandidatoText.trim() ||
        c.candidatoNome?.toLowerCase().includes(this.filtroCandidatoText.toLowerCase()) ||
        (c.candidatoEmail && c.candidatoEmail.toLowerCase().includes(this.filtroCandidatoText.toLowerCase()));
      const bateStatus = this.filtroStatusSelecionado === 'TODOS' || c.status === this.filtroStatusSelecionado;
      return bateTexto && bateStatus;
    });
  }

  get vagasFiltradasComCandidatos(): VagaComCandidatos[] {
    return this.vagasAgrupadas
      .map(item => ({
        vaga: item.vaga,
        candidaturas: this.filtrarCandidaturasDaVaga(item.candidaturas)
      }))
      .filter(item => item.candidaturas.length > 0);
  }

  abrirModalAvaliacao(candidatura: Candidatura): void {
    this.candidaturaEmEdicao = candidatura;
    this.mostrarModalAvaliacao = true;

    this.avaliacaoForm.patchValue({
      status: candidatura.status || 'RECEBIDA',
      notaAvaliacao: candidatura.notaAvaliacao || null,
      feedback: candidatura.feedback || ''
    });

    this.cdr.detectChanges();
  }

  fecharModal(): void {
    this.mostrarModalAvaliacao = false;
    this.candidaturaEmEdicao = null;
    this.avaliacaoForm.reset({ status: 'EM_ANALISE' });
    this.cdr.detectChanges();
  }

  fecharDialogErroNota(): void {
    this.mostrarDialogErroNota = false;
    this.cdr.detectChanges();
  }

  salvarAvaliacao(): void {
    if (!this.candidaturaEmEdicao) return;

    const notaValor = this.avaliacaoForm.value.notaAvaliacao;

    if (notaValor !== null && notaValor !== undefined && notaValor !== '') {
      const notaNum = Number(notaValor);
      if (notaNum < 1 || notaNum > 10) {
        this.mostrarDialogErroNota = true;
        this.cdr.detectChanges();
        return;
      }
    }

    if (this.avaliacaoForm.invalid) return;

    const payload = {
      status: this.avaliacaoForm.value.status,
      feedback: this.avaliacaoForm.value.feedback,
      notaAvaliacao: notaValor ? Number(notaValor) : undefined
    };

    this.candidaturaService.avaliarCandidato(this.candidaturaEmEdicao.id, payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Avaliação salva com sucesso!';
        this.fecharModal();

        if (this.vagaSelecionadaId) {
          this.buscarCandidatosDaVaga(this.vagaSelecionadaId);
        } else {
          this.buscarTodasAsCandidaturas();
        }

        setTimeout(() => {
          this.mensagemSucesso = null;
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error('Erro ao avaliar candidato:', err);
        this.mensagemErro = 'Erro ao salvar avaliação do candidato.';
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}