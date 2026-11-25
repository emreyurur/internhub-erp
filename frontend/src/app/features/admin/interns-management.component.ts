import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import {
  CreateInternResponse,
  Discipline,
  InternItem,
  MentorItem,
} from '../../core/models/domain.models';

@Component({
  selector: 'app-interns-management',
  imports: [DatePipe, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Intern Directory</h1>
        <p class="page-subtitle">
          Manage intern accounts, mentor pairings, academic metadata, and program tenures.
        </p>
      </div>
      <div class="header-actions">
        <button type="button" class="btn btn-primary" (click)="openCreateModal()">
          + Register Intern
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
            placeholder="Search name, email, or university..."
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
          <select
            class="select filter-select"
            [ngModel]="selectedDepartment()"
            (ngModelChange)="selectedDepartment.set($event)"
          >
            <option value="">All Departments</option>
            @for (dep of departments(); track dep) {
              <option [value]="dep">{{ dep }}</option>
            }
          </select>
        </div>
        <span class="record-count">
          Showing {{ filteredInterns().length }} of {{ interns().length }} records
        </span>
      </div>

      @if (loading()) {
        <div class="empty-state">Loading intern directory...</div>
      } @else if (filteredInterns().length === 0) {
        <div class="empty-state">
          <h3>No matching intern records</h3>
          <p>Adjust active filters or register a new intern.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Intern</th>
                <th>Track / Dept</th>
                <th>University &amp; Contact</th>
                <th>Assigned Mentor</th>
                <th>Tenure End</th>
                <th style="text-align: right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (intern of filteredInterns(); track intern.id) {
                <tr>
                  <td class="record-id">INT-{{ pad(intern.id) }}</td>
                  <td>
                    <div class="entity-cell">
                      <div class="initials-chip">{{ intern.name[0] }}{{ intern.lastname[0] }}</div>
                      <div>
                        <div class="cell-primary">{{ intern.name }} {{ intern.lastname }}</div>
                        <div class="cell-secondary">{{ intern.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="tag tag-accent">{{ intern.discipline }}</span>
                    <div class="cell-secondary" style="margin-top: 0.2rem">{{ intern.department }}</div>
                  </td>
                  <td>
                    <div class="cell-primary">{{ intern.university || '—' }}</div>
                    <div class="cell-secondary mono">{{ intern.phone || '' }}</div>
                  </td>
                  <td>
                    @if (intern.mentorName) {
                      <span>{{ intern.mentorName }}</span>
                    } @else {
                      <span class="tag tag-warning"><span class="tag-dot"></span>Unassigned</span>
                    }
                  </td>
                  <td class="mono">{{ intern.endDate ? (intern.endDate | date: 'yyyy-MM-dd') : '—' }}</td>
                  <td>
                    <div class="row-actions">
                      <button
                        type="button"
                        class="btn btn-danger-outline btn-sm"
                        (click)="deleteIntern(intern)"
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
            <h2 class="modal-title">Register New Intern</h2>
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
              <div class="field">
                <label>Assigned Mentor</label>
                <select class="select" name="mentorId" [(ngModel)]="form.mentorId">
                  <option [ngValue]="null">Unassigned</option>
                  @for (m of mentors(); track m.id) {
                    <option [ngValue]="m.id">{{ m.name }} {{ m.lastname }} ({{ m.discipline }})</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>Program End Date</label>
                <input class="input mono" type="date" name="endDate" [(ngModel)]="form.endDate" />
              </div>
              <div class="field">
                <label>University</label>
                <input class="input" name="university" [(ngModel)]="form.university" placeholder="e.g. Georgia Tech" />
              </div>
              <div class="field">
                <label>Phone Number</label>
                <input class="input" name="phone" [(ngModel)]="form.phone" placeholder="+1 (555) 000-0000" />
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
            <h2 class="modal-title">Intern Account Provisioned</h2>
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
})
export class InternsManagementComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly interns = signal<InternItem[]>([]);
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
  protected readonly selectedDepartment = signal('');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly showCreateModal = signal(false);
  protected readonly createdResult = signal<CreateInternResponse | null>(null);

  protected form = this.emptyForm();

  protected readonly filteredInterns = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const disc = this.selectedDiscipline();
    const dep = this.selectedDepartment();
    return this.interns().filter((i) => {
      if (disc && i.discipline !== disc) return false;
      if (dep && i.department !== dep) return false;
      if (!q) return true;
      return (
        `${i.name} ${i.lastname}`.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.university ?? '').toLowerCase().includes(q)
      );
    });
  });

  protected pad(id: number): string {
    return String(id).padStart(4, '0');
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  private emptyForm() {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return {
      name: '',
      lastname: '',
      email: '',
      department: 'Engineering',
      discipline: 'Frontend' as Discipline,
      mentorId: null as number | null,
      phone: '',
      university: '',
      endDate: end.toISOString().slice(0, 10),
    };
  }

  private async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const [interns, mentors, departments, disciplines] = await Promise.all([
        this.api.getAllInterns(),
        this.api.getAllMentors(),
        this.api.getDepartments(),
        this.api.getDisciplines(),
      ]);
      this.interns.set(interns);
      this.mentors.set(mentors);
      this.departments.set(departments);
      this.disciplines.set(disciplines);
    } catch {
      this.toast.error('Failed to retrieve intern directory.');
    } finally {
      this.loading.set(false);
    }
  }

  protected openCreateModal(): void {
    this.form = this.emptyForm();
    this.showCreateModal.set(true);
  }

  protected async submitCreate(): Promise<void> {
    this.saving.set(true);
    try {
      const created = await this.api.createIntern({
        name: this.form.name.trim(),
        lastname: this.form.lastname.trim(),
        email: this.form.email.trim(),
        department: this.form.department,
        discipline: this.form.discipline,
        mentorId: this.form.mentorId,
        phone: this.form.phone.trim() || undefined,
        university: this.form.university.trim() || undefined,
        endDate: this.form.endDate ? new Date(this.form.endDate).toISOString() : undefined,
        role: 'Intern',
      });
      this.showCreateModal.set(false);
      this.createdResult.set(created);
      this.toast.success('Intern record created.');
      await this.loadData();
    } catch {
      this.toast.error('Could not create intern. Ensure email address is unique.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async deleteIntern(intern: InternItem): Promise<void> {
    if (!confirm(`Remove intern ${intern.name} ${intern.lastname} and their assigned tasks?`)) {
      return;
    }
    try {
      await this.api.deleteIntern(intern.id);
      this.toast.success('Intern record removed.');
      await this.loadData();
    } catch {
      this.toast.error('Failed to remove intern record.');
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
