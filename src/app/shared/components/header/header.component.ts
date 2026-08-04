import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() brandIcon = '💼';
  @Input() title = '';
  @Input() tag = '';
  @Input() brandRoute = '/vagas';

  @Input() quickLinkIcon?: string;
  @Input() quickLinkLabel?: string;
  @Input() quickLinkRoute?: string;

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  get userName(): string {
    return this.authService.getNome();
  }

  get avatarLetter(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }

  navigateBrand(): void {
    this.router.navigate([this.brandRoute]);
  }

  navigateQuickLink(): void {
    if (this.quickLinkRoute) {
      this.router.navigate([this.quickLinkRoute]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
