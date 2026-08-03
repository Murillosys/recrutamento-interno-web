import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidaturaService } from '../../services/candidatura.service';
import { AuthService } from '../../services/auth.service';
import { Candidatura } from '../../core/models/candidatura.model';
import { ThemeService } from '../../core/services/theme.service';

@Component({
    selector: 'app-painel-candidato',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './painel-candidato.component.html',
    styleUrls: ['./painel-candidato.component.scss']
})
export class PainelCandidatoComponent implements OnInit {
    candidaturas: Candidatura[] = [];
    loading = false;
    mensagemErro: string | null = null;
    userName: string | null = '';

    constructor(
        public themeService: ThemeService,
        private candidaturaService: CandidaturaService,
        private authService: AuthService,
        public router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.userName = this.authService.getNome();
        this.carregarCandidaturas();
    }

    carregarCandidaturas(): void {
        this.loading = true;
        this.candidaturaService.listarMinhasCandidaturas().subscribe({
            next: (dados) => {
                this.candidaturas = dados;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.mensagemErro = 'Erro ao carregar o histórico de candidaturas.';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}