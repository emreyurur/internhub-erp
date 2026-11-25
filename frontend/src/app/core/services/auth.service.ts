import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AppMode, Role, UserSession } from '../models/domain.models';
import { DemoStoreService } from './demo-store.service';

const SESSION_KEY = 'internhub_erp_session_v2';
const MODE_KEY = 'internhub_erp_mode_v2';
const API_URL_KEY = 'internhub_erp_api_url_v2';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly demoStore = inject(DemoStoreService);

  readonly currentUser = signal<UserSession | null>(this.readSession());
  readonly mode = signal<AppMode>(this.readMode());
  readonly apiBaseUrl = signal<string>(this.readApiUrl());

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userRole = computed<Role | null>(() => this.currentUser()?.role ?? null);
  readonly fullName = computed(() => {
    const u = this.currentUser();
    return u ? `${u.name} ${u.lastname}` : '';
  });

  private readSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as UserSession) : null;
    } catch {
      return null;
    }
  }

  private readMode(): AppMode {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === 'api' || saved === 'demo') return saved;
    return 'demo';
  }

  private readApiUrl(): string {
    return localStorage.getItem(API_URL_KEY) ?? '';
  }

  setMode(mode: AppMode): void {
    this.mode.set(mode);
    localStorage.setItem(MODE_KEY, mode);
  }

  setApiBaseUrl(url: string): void {
    const clean = url.trim().replace(/\/+$/, '');
    this.apiBaseUrl.set(clean);
    localStorage.setItem(API_URL_KEY, clean);
  }

  async login(email: string, password: string): Promise<UserSession> {
    if (this.mode() === 'demo') {
      const session = this.demoStore.login(email, password);
      if (!session) {
        throw new Error('Invalid sandbox credentials. Use password "demo" for sandbox accounts.');
      }
      this.persistSession(session);
      return session;
    }

    const base = this.apiBaseUrl();
    const session = await firstValueFrom(
      this.http.post<UserSession>(`${base}/api/Auth/login`, { email, password })
    );
    this.persistSession(session);
    return session;
  }

  quickDemoLogin(email: string): void {
    this.setMode('demo');
    const session = this.demoStore.login(email, 'demo');
    if (session) {
      this.persistSession(session);
      this.navigateByRole(session.role);
    }
  }

  navigateByRole(role: Role): void {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Mentor') {
      this.router.navigate(['/mentor']);
    } else {
      this.router.navigate(['/intern']);
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/login']);
  }

  private persistSession(session: UserSession): void {
    this.currentUser.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}
