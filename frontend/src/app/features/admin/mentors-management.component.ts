import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { CreateMentorResponse, Discipline, MentorItem } from '../../core/models/domain.models';

@Component({
  selector: 'app-mentors-management',
  imports: [FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Mentor Directory</h1>
        <p class="page-subtitle">
          Provision engineering mentors and monitor active intern workload allocation.
        </p>
      </div>
      <div class="header-actions">
        <button type="button" class="btn btn-primary" (click)="openCreateModal()">
          + Register Mentor
        </button>
      </div>
    </div>

    <section class="card">
      <div class="toolbar">
        <div class="toolbar-filters">
          <input
            type="search"
            class="input search-input"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search mentor name or email..."
          />
          <select
            class="select filter-select"
            [ngModel]="selectedDiscipline()"
            (ngModelChange)="selectedDiscipline.set($event)"
          >
            <option value="">All Disciplines</option>
            @for (d of disciplines(); track d) {
              <option [value]="d">{{ d }}</option>
            }
          </select>
        </div>
        <span class="record-count">
          Showing {{ filteredMentors().length }} of {{ mentors().length }} records
        </span>
      </div>

      @if (loading()) {
        <div class="empty-state">Loading mentor directory...</div>
      } @else if (filteredMentors().length === 0) {
        <div class="empty-state">
          <h3>No mentor records found</h3>
          <p>Register a mentor to begin assigning interns.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mentor</th>
                <th>Department</th>
                <th>Discipline</th>
                <th>Assigned Workload</th>
                <th style="text-align: right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (mentor of filteredMentors(); track mentor.id) {
                <tr>
                  <td class="record-id">MNT-{{ pad(mentor.id) }}</td>
                  <td>
                    <div class="entity-cell">
                      <div class="initials-chip">{{ mentor.name[0] }}{{ mentor.lastname[0] }}</div>
                      <div>
                        <div class="cell-primary">{{ mentor.name }} {{ mentor.lastname }}</div>
                        <div class="cell-secondary">{{ mentor.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ mentor.department }}</td>
                  <td><span class="tag tag-accent">{{ mentor.discipline }}</span></td>
                  <td>
                    <div class="workload-cell">
                      <span class="mono">{{ mentor.internCount }} interns</span>
                      <div class="progress-track" style="max-width: 110px">
                        <div
                          class="progress-fill"
                          [style.width.%]="Math.min(mentor.internCount * 25, 100)"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button
                        type="button"
                        class="btn btn-danger-outline btn-sm"
                        (click)="deleteMentor(mentor)"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    @if (showCreateModal()) {
      <div class="modal-backdrop" (click)="showCreateModal.set(false)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Register New Mentor</h2>
            <button type="button" class="btn btn-ghost btn-sm" (click)="showCreateModal.set(false)">×</button>
          </div>
          <form (ngSubmit)="submitCreate()">
            <div class="modal-body form-grid">
              <div class="field">
                <label>First Name *</label>
                <input class="input" name="name" required [(ngModel)]="form.name" />
              </div>
              <div class="field">
                <label>Last Name *</label>
                <input class="input" name="lastname" required [(ngModel)]="form.lastname" />
              </div>
              <div class="field span-2">
                <label>Corporate Email *</label>
                <input class="input" type="email" name="email" required [(ngModel)]="form.email" />
              </div>
              <div class="field">
                <label>Department *</label>
                <select class="select" name="department" required [(ngModel)]="form.department">
                  @for (dep of departments(); track dep) {
                    <option [value]="dep">{{ dep }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>Discipline *</label>
                <select class="select" name="discipline" required [(ngModel)]="form.discipline">
                  @for (d of disciplines(); track d) {
                    <option [value]="d">{{ d }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showCreateModal.set(false)">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                {{ saving() ? 'Creating...' : 'Create Record' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (createdResult()) {
      <div class="modal-backdrop" (click)="createdResult.set(null)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Mentor Account Provisioned</h2>
            <button type="button" class="btn btn-ghost btn-sm" (click)="createdResult.set(null)">×</button>
          </div>
          <div class="modal-body">
            <p style="margin-bottom: 0.85rem; color: var(--text-muted); font-size: 0.84rem">
              Temporary first-login credential generated for
              <strong>{{ createdResult()!.name }} {{ createdResult()!.lastname }}</strong>
              (<span class="mono">{{ createdResult()!.email }}</span>):
            </p>
            <div class="credential-box">
              <span>{{ createdResult()!.password }}</span>
              <button type="button" class="btn btn-primary btn-sm" (click)="copyPassword(createdResult()!.password)">
                Copy
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="createdResult.set(null)">Done</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .workload-cell {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
  `,
})
export class MentorsManagementComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly Math = Math;
  protected readonly mentors = signal<MentorItem[]>([]);
  protected readonly departments = signal<string[]>(['Engineering', 'HR', 'Marketing']);
  protected readonly disciplines = signal<Discipline[]>([
    'Frontend',
    'Backend',
    'Ios',
    'Android',
    'BusinessAnalyst',
  ]);

  protected readonly searchQuery = signal('');
  protected readonly selectedDiscipline = signal('');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly showCreateModal = signal(false);
  protected readonly createdResult = signal<CreateMentorResponse | null>(null);

  protected form = {
    name: '',
    lastname: '',
    email: '',
    department: 'Engineering',
    discipline: 'Frontend' as Discipline,
  };

  protected readonly filteredMentors = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const disc = this.selectedDiscipline();
    return this.mentors().filter((m) => {
      if (disc && m.discipline !== disc) return false;
      if (!q) return true;
      return `${m.name} ${m.lastname}`.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    });
  });

  protected pad(id: number): string {
    return String(id).padStart(4, '0');
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const [mentors, departments, disciplines] = await Promise.all([
        this.api.getAllMentors(),
        this.api.getDepartments(),
        this.api.getDisciplines(),
      ]);
      this.mentors.set(mentors);
      this.departments.set(departments);
      this.disciplines.set(disciplines);
    } catch {
      this.toast.error('Failed to retrieve mentor directory.');
    } finally {
      this.loading.set(false);
    }
  }

  protected openCreateModal(): void {
    this.form = {
      name: '',
      lastname: '',
      email: '',
      department: 'Engineering',
      discipline: 'Frontend',
    };
    this.showCreateModal.set(true);
  }

  protected async submitCreate(): Promise<void> {
    this.saving.set(true);
    try {
      const created = await this.api.createMentor({
        name: this.form.name.trim(),
        lastname: this.form.lastname.trim(),
        email: this.form.email.trim(),
        department: this.form.department,
        discipline: this.form.discipline,
        role: 'Mentor',
      });
      this.showCreateModal.set(false);
      this.createdResult.set(created);
      this.toast.success('Mentor record created.');
      await this.loadData();
    } catch {
      this.toast.error('Could not create mentor. Ensure email address is unique.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async deleteMentor(mentor: MentorItem): Promise<void> {
    if (
      !confirm(
        `Remove mentor ${mentor.name} ${mentor.lastname}? Assigned interns will be marked as unassigned.`
      )
    ) {
      return;
    }
    try {
      await this.api.deleteMentor(mentor.id);
      this.toast.success('Mentor record removed.');
      await this.loadData();
    } catch {
      this.toast.error('Failed to remove mentor record.');
    }
  }

  protected async copyPassword(password: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(password);
      this.toast.success('Temporary password copied to clipboard.');
    } catch {
      this.toast.info('Select and copy the password manually.');
    }
  }
}
