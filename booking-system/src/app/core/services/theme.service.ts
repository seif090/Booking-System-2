import { Injectable, signal, effect } from '@angular/core';

const THEME_KEY = 'bs_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _isDark = signal<boolean>(false);
  readonly isDark = this._isDark.asReadonly();

  constructor() {
    this._loadFromStorage();
    effect(() => {
      const theme = this._isDark() ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.classList.toggle('dark', this._isDark());
    });
  }

  private _loadFromStorage(): void {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') {
      this._isDark.set(true);
    } else if (saved === 'light') {
      this._isDark.set(false);
    } else {
      const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
      this._isDark.set(prefersDark);
    }
  }

  toggle(): void {
    this._isDark.update((v: boolean) => !v);
  }

  setDark(isDark: boolean): void {
    this._isDark.set(isDark);
  }
}
