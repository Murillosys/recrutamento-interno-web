import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  mensagemErro: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.mensagemErro = null;

    const { email, senha } = this.loginForm.value;

    this.authService.login({ email, senha })
      .pipe(       
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/vagas']);
        },
        error: (err) => {
          console.error('Erro detalhado no login:', err);          
          const status = err?.status || err?.error?.status;

          if (status === 401 || status === 403) {
            this.mensagemErro = 'Usuário ou senha incorretos.';
          } else if (status === 0) {
            this.mensagemErro = 'Não foi possível conectar ao servidor. Verifique sua conexão ou a API.';
          } else {
            this.mensagemErro = err?.error?.message || 'Usuário ou senha incorretos.';
          }          
          this.cdr.detectChanges();
        }
      });
  }
}