import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DemoStoreService } from '../../core/services/demo-store.service';
import { ToastService } from '../../core/services/toast.service';
import { AppMode } from '../../core/models/domain.models';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="auth-canvas">
      <div class="auth-shell">
        <header class="auth-brand">
          <div class="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 17.5h7M17.5 14v7" />
            </svg>
          </div>
          <div>
            <div class="brand-title">InternHub <span class="brand-tag">ERP</span></div>
            <div class="brand-sub">Workforce &amp; Internship Operations Suite</div>
          </div>
        </header>

        <section class="auth-panel card">
          <div class="panel-top">
            <div>
              <h1>Sign in to workspace</h1>
              <p>Authenticate with your corporate credentials or select a sandbox role.</p>
            </div>
            <div class="segmented" role="tablist" aria-label="Environment">
              <button
                type="button"
                class="segmented-btn"
                [class.active]="auth.mode() === 'demo'"
                (click)="switchMode('demo')"
              >
                Sandbox
              </button>
              <button
                type="button"
                class="segmented-btn"
                [class.active]="auth.mode() === 'api'"
                (click)="switchMode('api')"
              >
                Live API
              </button>
            </div>
          </div>

          <div class="panel-body">
            @if (auth.mode() === 'api') {
              <div class="field api-field">
                <label for="apiUrl">Backend Endpoint URL (optional)</label>
                <input
                  id="apiUrl"
                  class="input mono"
                  type="url"
                  [ngModel]="apiUrl()"
                  (ngModelChange)="onApiUrlChange($event)"
                  placeholder="Leave blank for /api proxy or enter https://api.domain.com"
                />
              </div>
            }

            <form (ngSubmit)="submit()" class="login-form">
              <div class="field">
                <label for="email">Work Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  class="input"
                  required
                  [(ngModel)]="email"
                  placeholder="name@company.io"
                />
              </div>

              <div class="field">
                <label for="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  class="input"
                  required
                  [(ngModel)]="password"
                  placeholder="Enter password"
                />
              </div>

              @if (error()) {
                <div class="error-banner" role="alert">{{ error() }}</div>
              }

              <button type="submit" class="btn btn-primary submit-btn" [disabled]="loading()">
                {{ loading() ? 'Authenticating...' : 'Continue' }}
              </button>
            </form>
          </div>

          @if (auth.mode() === 'demo') {
            <div class="sandbox-section">
              <div class="sandbox-header">
                <span>Sandbox Quick Access</span>
                <span class="mono">password: demo</span>
              </div>
              <div class="sandbox-list">
                @for (acc of demoAccounts; track acc.email) {
                  <button type="button" class="sandbox-row" (click)="quickLogin(acc.email)">
                    <div class="sandbox-identity">
                      <span class="sandbox-name">{{ acc.label }}</span>
                      <span class="sandbox-meta">{{ acc.scope }}</span>
                    </div>
                    <span
                      class="tag"
                      [class.tag-accent]="acc.role === 'Admin'"
                      [class.tag-warning]="acc.role === 'Mentor'"
                      [class.tag-success]="acc.role === 'Intern'"
                    >
                      <span class="tag-dot"></span>
                      {{ acc.role }}
                    </span>
                  </button>
                }
              </div>
            </div>
          }
        </section>

        <footer class="auth-footer">
          <span>InternHub Operations v2.0</span>
          <span>ASP.NET Core 8 · Angular 22</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    .auth-canvas {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem 1.25rem;
      background-color: #f4f4f5;
      background-image: radial-gradient(#d4d4d8 0.75px, transparent 0.75px);
      background-size: 20px 20px;
    }

    .auth-shell {
      width: 100%;
      max-width: 460px;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .auth-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 0.15rem;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: #111827;
      color: #ffffff;
      display: grid;
      place-items: center;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .brand-title {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .brand-tag {
      font-family: var(--mono);
      font-size: 0.68rem;
      font-weight: 600;
      padding: 0.08rem 0.35rem;
      border-radius: 4px;
      background: #e4e4e7;
      color: #3f3f46;
    }

    .brand-sub {
      font-size: 0.78rem;
      color: var(--text-soft);
    }

    .auth-panel {
      overflow: hidden;
    }

    .panel-top {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 1.25rem 1.35rem 1rem;
      border-bottom: 1px solid var(--border);

      h1 {
        font-size: 1.05rem;
        font-weight: 600;
        letter-spacing: -0.015em;
      }

      p {
        margin-top: 0.2rem;
        font-size: 0.8rem;
        color: var(--text-soft);
      }
    }

    .panel-body {
      padding: 1.25rem 1.35rem;
    }

    .api-field {
      margin-bottom: 0.9rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .submit-btn {
      width: 100%;
      height: 36px;
      margin-top: 0.2rem;
    }

    .error-banner {
      padding: 0.55rem 0.75rem;
      border-radius: 6px;
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      color: var(--danger);
      font-size: 0.8rem;
      font-weight: 500;
    }

    .sandbox-section {
      border-top: 1px solid var(--border);
      background: #fafafa;
      padding: 0.9rem 1.35rem 1.15rem;
    }

    .sandbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.045em;
      color: var(--text-soft);
      margin-bottom: 0.65rem;
    }

    .sandbox-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--surface);
      overflow: hidden;
    }

    .sandbox-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      width: 100%;
      padding: 0.62rem 0.8rem;
      border: none;
      border-bottom: 1px solid var(--border);
      background: transparent;
      text-align: left;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: var(--surface-hover);
      }
    }

    .sandbox-identity {
      display: flex;
      flex-direction: column;
    }

    .sandbox-name {
      font-size: 0.83rem;
      font-weight: 600;
      color: var(--text);
    }

    .sandbox-meta {
      font-size: 0.74rem;
      color: var(--text-soft);
    }

    .auth-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.74rem;
      color: var(--text-soft);
      padding: 0 0.15rem;
    }
  `,
})
export class LoginComponent {
  protected readonly auth = inject(AuthService);
  private readonly demoStore = inject(DemoStoreService);
  private readonly toast = inject(ToastService);

  protected email = 'admin@internhub.io';
  protected password = 'demo';
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly apiUrl = signal(this.auth.apiBaseUrl());
  protected readonly demoAccounts = this.demoStore.getDemoAccounts();

  protected switchMode(mode: AppMode): void {
    this.auth.setMode(mode);
    this.error.set('');
    if (mode === 'demo') {
      this.email = 'admin@internhub.io';
      this.password = 'demo';
    } else {
      this.email = '';
      this.password = '';
    }
  }

  protected onApiUrlChange(url: string): void {
    this.apiUrl.set(url);
    this.auth.setApiBaseUrl(url);
  }

  protected async submit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      const session = await this.auth.login(this.email, this.password);
      this.toast.success(`Signed in as ${session.name} ${session.lastname}`);
      this.auth.navigateByRole(session.role);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Check backend connectivity and credentials.';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  protected quickLogin(email: string): void {
    this.auth.quickDemoLogin(email);
    this.toast.info('Sandbox session initialized.');
  }
}
