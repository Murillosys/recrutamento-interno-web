import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme-preference';
  private isDark = true;

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = true;
    }
    this.aplicarTema();
  }

  public isDarkMode(): boolean {
    return this.isDark;
  }

  public toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
    this.aplicarTema();
  }

  private aplicarTema(): void {
    if (this.isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}