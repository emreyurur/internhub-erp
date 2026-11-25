import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { DemoStoreService } from '../core/services/demo-store.service';
import { ToastService } from '../core/services/toast.service';

type NavIcon = 'overview' | 'interns' | 'mentors' | 'catalog' | 'tasks';

interface NavGroup {
  heading: string;
  items: { label: string; route: string; exact?: boolean; icon: NavIcon }[];
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="erp-shell" [class.sidebar-open]="mobileOpen()">
      <aside class="rail">
        <div class="rail-header">
          <div class="rail-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 17.5h7M17.5 14v7" />
            </svg>
          </div>
          <div class="rail-brand">
            <span class="rail-name">InternHub</span>
            <span class="rail-edition">ERP · Operations</span>
          </div>
          <button
            type="button"
            class="close-mobile"
            (click)="mobileOpen.set(false)"
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <nav class="rail-nav" aria-label="Main navigation">
          @for (group of navGroups(); track group.heading) {
            <div class="nav-group">
              <div class="nav-heading">{{ group.heading }}</div>
              @for (item of group.items; track item.route) {
                <a
                  class="nav-link"
                  [routerLink]="item.route"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: !!item.exact }"
                  (click)="mobileOpen.set(false)"
                >
                  @switch (item.icon) {
                    @case ('overview') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                      </svg>
                    }
                    @case ('interns') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    @case ('mentors') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      </svg>
                    }
                    @case ('catalog') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    }
                    @case ('tasks') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    }
                  }
                  <span>{{ item.label }}</span>
                </a>
              }
            </div>
          }
        </nav>

        <div class="rail-footer">
          <div class="account-card">
            <div class="account-avatar">{{ initials() }}</div>
            <div class="account-info">
              <div class="account-name">{{ auth.fullName() }}</div>
              <div class="account-role">{{ auth.userRole() }} · {{ auth.currentUser()?.department }}</div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm signout-btn" (click)="auth.logout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      @if (mobileOpen()) {
        <div class="backdrop" (click)="mobileOpen.set(false)"></div>
      }

      <div class="workspace">
        <header class="topbar">
          <div class="topbar-left">
            <button
              type="button"
              class="menu-btn"
              (click)="mobileOpen.set(true)"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div class="breadcrumb">
              <span class="crumb-root">{{ workspaceLabel() }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ currentSection() }}</span>
            </div>
          </div>

          <div class="topbar-right">
            @if (auth.mode() === 'demo') {
              <span class="tag tag-warning">
                <span class="tag-dot"></span>
                Sandbox Mode
              </span>
              <button type="button" class="btn btn-secondary btn-sm" (click)="resetDemo()">
                Reset Data
              </button>
            } @else {
              <span class="tag tag-success">
                <span class="tag-dot"></span>
                Live .NET API
              </span>
            }
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `
    .erp-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 236px minmax(0, 1fr);
    }

    .rail {
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .rail-header {
      height: 52px;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0 0.9rem;
      border-bottom: 1px solid var(--border);
    }

    .rail-logo {
      width: 28px;
      height: 28px;
      border-radius: 5px;
      background: #111827;
      color: #ffffff;
      display: grid;
      place-items: center;
      flex-shrink: 0;

      svg {
        width: 15px;
        height: 15px;
      }
    }

    .rail-brand {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .rail-name {
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
    }

    .rail-edition {
      font-size: 0.68rem;
      color: var(--text-soft);
    }

    .close-mobile {
      display: none;
      margin-left: auto;
      border: none;
      background: transparent;
      color: var(--text-soft);
      font-size: 1.35rem;
      cursor: pointer;
    }

    .rail-nav {
      flex: 1;
      overflow-y: auto;
      padding: 0.85rem 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .nav-heading {
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-soft);
      padding: 0 0.55rem 0.3rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.48rem 0.6rem;
      border-radius: 6px;
      font-size: 0.83rem;
      font-weight: 500;
      color: var(--text-muted);
      transition: background-color 0.12s ease, color 0.12s ease;

      svg {
        width: 15px;
        height: 15px;
        color: var(--text-soft);
        flex-shrink: 0;
      }

      &:hover {
        background: var(--surface-subtle);
        color: var(--text);
      }

      &.active {
        background: #111827;
        color: #ffffff;

        svg {
          color: #ffffff;
        }
      }
    }

    .rail-footer {
      border-top: 1px solid var(--border);
      padding: 0.8rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      background: #fafafa;
    }

    .account-card {
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }

    .account-avatar {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      background: #111827;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.73rem;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .account-info {
      min-width: 0;
    }

    .account-name {
      font-size: 0.81rem;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .account-role {
      font-size: 0.71rem;
      color: var(--text-soft);
    }

    .signout-btn {
      width: 100%;
    }

    .workspace {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .topbar {
      height: 52px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 1.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 20;
    }

    .topbar-left,
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .menu-btn {
      display: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid var(--border-strong);
      background: var(--surface);
      cursor: pointer;

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.82rem;
    }

    .crumb-root {
      color: var(--text-soft);
    }

    .crumb-sep {
      color: var(--border-strong);
    }

    .crumb-current {
      font-weight: 600;
      color: var(--text);
    }

    .content {
      padding: 1.4rem 1.6rem 2rem;
      max-width: 1380px;
      width: 100%;
      margin: 0 auto;
    }

    .backdrop {
      display: none;
    }

    @media (max-width: 900px) {
      .erp-shell {
        grid-template-columns: 1fr;
      }

      .rail {
        position: fixed;
        inset: 0 auto 0 0;
        width: 248px;
        z-index: 60;
        transform: translateX(-100%);
        transition: transform 0.18s ease;
      }

      .erp-shell.sidebar-open .rail {
        transform: translateX(0);
      }

      .erp-shell.sidebar-open .backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(17, 24, 39, 0.4);
        z-index: 50;
      }

      .menu-btn,
      .close-mobile {
        display: inline-grid;
        place-items: center;
      }

      .content {
        padding: 1rem;
      }
    }
  `,
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly demoStore = inject(DemoStoreService);
  private readonly toast = inject(ToastService);

  protected readonly mobileOpen = signal(false);
  protected readonly currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }

  protected readonly initials = computed(() => {
    const u = this.auth.currentUser();
    if (!u) return 'U';
    return `${u.name[0] ?? ''}${u.lastname[0] ?? ''}`.toUpperCase();
  });

  protected readonly workspaceLabel = computed(() => {
    const role = this.auth.userRole();
    if (role === 'Admin') return 'Administration';
    if (role === 'Mentor') return 'Mentor Operations';
    return 'Intern Portal';
  });

  protected readonly currentSection = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/interns')) return 'Intern Directory';
    if (url.includes('/mentors')) return 'Mentor Directory';
    if (url.includes('/assignments')) return 'Assignment Catalog';
    if (url.startsWith('/mentor')) return 'Assigned Interns & Tasks';
    if (url.startsWith('/intern')) return 'My Tasks & Profile';
    return 'Executive Overview';
  });

  protected readonly navGroups = computed<NavGroup[]>(() => {
    const role = this.auth.userRole();
    if (role === 'Admin') {
      return [
        {
          heading: 'Workspace',
          items: [{ label: 'Executive Overview', route: '/admin', exact: true, icon: 'overview' }],
        },
        {
          heading: 'Directory',
          items: [
            { label: 'Interns', route: '/admin/interns', icon: 'interns' },
            { label: 'Mentors', route: '/admin/mentors', icon: 'mentors' },
          ],
        },
        {
          heading: 'Operations',
          items: [{ label: 'Assignment Catalog', route: '/admin/assignments', icon: 'catalog' }],
        },
      ];
    }
    if (role === 'Mentor') {
      return [
        {
          heading: 'Operations',
          items: [
            { label: 'Interns & Tasks', route: '/mentor', exact: true, icon: 'tasks' },
            { label: 'Assignment Catalog', route: '/mentor/assignments', icon: 'catalog' },
          ],
        },
      ];
    }
    return [
      {
        heading: 'Portal',
        items: [{ label: 'My Tasks & Profile', route: '/intern', exact: true, icon: 'tasks' }],
      },
    ];
  });

  protected resetDemo(): void {
    this.demoStore.reset();
    this.toast.info('Sandbox dataset restored to defaults.');
    window.location.reload();
  }
}
