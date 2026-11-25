import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AssignmentItem, TaskType } from '../../core/models/domain.models';

@Component({
  selector: 'app-assignments-management',
  imports: [DatePipe, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Assignment Catalog</h1>
        <p class="page-subtitle">
          Standardized project, domain, and milestone templates available for mentor delegation.
        </p>
      </div>
      <div class="header-actions">
        <button type="button" class="btn btn-primary" (click)="openCreate()">+ New Template</button>
      </div>
    </div>

    <section class="card">
      <div class="toolbar">
        <div class="toolbar-filters">
          <input
            type="search"
            class="input search-input"
            [ngModel]="search()"
            (ngModelChange)="search.set($event)"
            placeholder="Search title or specification..."
          />

          <div class="segmented">
            @for (t of typeOptions; track t.value) {
              <button
                type="button"
                class="segmented-btn"
                [class.active]="selectedType() === t.value"
                (click)="selectedType.set(t.value)"
              >
                {{ t.label }}
              </button>
            }
          </div>
        </div>
        <span class="record-count">
          Showing {{ filtered().length }} of {{ assignments().length }} templates
        </span>
      </div>

      @if (loading()) {
        <div class="empty-state">Loading assignment catalog...</div>
      } @else if (filtered().length === 0) {
        <div class="empty-state">
          <h3>No assignment templates found</h3>
          <p>Create a template so mentors can schedule tasks for interns.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Template &amp; Specification</th>
                <th>Category</th>
                <th>Created</th>
                <th style="text-align: right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (item of filtered(); track item.id) {
                <tr>
                  <td class="record-id">ASN-{{ pad(item.id) }}</td>
                  <td style="max-width: 520px">
                    <div class="cell-primary">{{ item.title }}</div>
                    <div class="cell-secondary">{{ item.description }}</div>
                  </td>
                  <td>
                    <span
                      class="tag"
                      [class.tag-accent]="item.taskType === 'Project'"
                      [class.tag-success]="item.taskType === 'Domain'"
                      [class.tag-warning]="item.taskType === 'Meeting'"
                    >
                      <span class="tag-dot"></span>
                      {{ item.taskType }}
                    </span>
                  </td>
                  <td class="mono">{{ item.createdAt | date: 'yyyy-MM-dd' }}</td>
                  <td>
                    <div class="row-actions">
                      <button type="button" class="btn btn-secondary btn-sm" (click)="openEdit(item)">
                        Edit
                      </button>
                      <button type="button" class="btn btn-danger-outline btn-sm" (click)="remove(item)">
                        Delete
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

    @if (showModal()) {
      <div class="modal-backdrop" (click)="showModal.set(false)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ editingId() ? 'Edit Assignment Template' : 'New Assignment Template' }}
            </h2>
            <button type="button" class="btn btn-ghost btn-sm" (click)="showModal.set(false)">×</button>
          </div>
          <form (ngSubmit)="submit()">
            <div class="modal-body form-grid">
              <div class="field span-2">
                <label>Template Title *</label>
                <input class="input" name="title" required [(ngModel)]="form.title" />
              </div>
              <div class="field span-2">
                <label>Category *</label>
                <select class="select" name="taskType" required [(ngModel)]="form.taskType">
                  <option value="Project">Project</option>
                  <option value="Domain">Domain</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
              <div class="field span-2">
                <label>Specification / Description *</label>
                <textarea class="textarea" name="description" required [(ngModel)]="form.description"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showModal.set(false)">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                {{ saving() ? 'Saving...' : editingId() ? 'Save Changes' : 'Create Template' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class AssignmentsManagementComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly assignments = signal<AssignmentItem[]>([]);
  protected readonly search = signal('');
  protected readonly selectedType = signal<'' | TaskType>('');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<number | null>(null);

  protected readonly typeOptions: { label: string; value: '' | TaskType }[] = [
    { label: 'All', value: '' },
    { label: 'Project', value: 'Project' },
    { label: 'Domain', value: 'Domain' },
    { label: 'Meeting', value: 'Meeting' },
  ];

  protected form: { title: string; description: string; taskType: TaskType } = {
    title: '',
    description: '',
    taskType: 'Project',
  };

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const type = this.selectedType();
    return this.assignments().filter((a) => {
      if (type && a.taskType !== type) return false;
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    });
  });

  protected pad(id: number): string {
    return String(id).padStart(4, '0');
  }

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.assignments.set(await this.api.getAllAssignments());
    } catch {
      this.toast.error('Failed to retrieve assignment catalog.');
    } finally {
      this.loading.set(false);
    }
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form = { title: '', description: '', taskType: 'Project' };
    this.showModal.set(true);
  }

  protected openEdit(item: AssignmentItem): void {
    this.editingId.set(item.id);
    this.form = {
      title: item.title,
      description: item.description,
      taskType: item.taskType,
    };
    this.showModal.set(true);
  }

  protected async submit(): Promise<void> {
    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        await this.api.updateAssignment({
          id,
          title: this.form.title.trim(),
          description: this.form.description.trim(),
          taskType: this.form.taskType,
        });
        this.toast.success('Assignment template updated.');
      } else {
        await this.api.createAssignment({
          title: this.form.title.trim(),
          description: this.form.description.trim(),
          taskType: this.form.taskType,
        });
        this.toast.success('Assignment template created.');
      }
      this.showModal.set(false);
      await this.load();
    } catch {
      this.toast.error('Failed to save assignment template.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async remove(item: AssignmentItem): Promise<void> {
    if (!confirm(`Delete template "${item.title}"? Linked intern tasks will also be removed.`)) {
      return;
    }
    try {
      await this.api.deleteAssignment(item.id);
      this.toast.success('Assignment template deleted.');
      await this.load();
    } catch {
      this.toast.error('Failed to delete assignment template.');
    }
  }
}
