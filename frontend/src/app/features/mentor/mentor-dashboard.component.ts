import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AssignmentItem, InternItem, InternTaskItem } from '../../core/models/domain.models';

type TaskFilter = 'all' | 'pending' | 'completed' | 'overdue';

@Component({
  selector: 'app-mentor-dashboard',
  imports: [DatePipe, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Mentor Operations</h1>
        <p class="page-subtitle">
          Monitor assigned intern deliverables, schedule deadlines, and audit completion SLA.
        </p>
      </div>
      <div class="header-actions">
        <button
          type="button"
          class="btn btn-primary"
          [disabled]="interns().length === 0 || assignments().length === 0"
          (click)="openAssignModal()"
        >
          + Assign Task
        </button>
      </div>
    </div>

    <section class="kpi-strip">
      <div class="kpi-cell">
        <span class="kpi-label">Assigned Interns</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ interns().length }}</span>
        </div>
        <span class="kpi-hint">{{ auth.currentUser()?.discipline || 'General' }} track</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Active Deliverables</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ allTasks().length }}</span>
        </div>
        <span class="kpi-hint">Across all assigned interns</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Completion Rate</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ completionRate() }}%</span>
          <span class="kpi-hint mono">({{ completedCount() }}/{{ allTasks().length }})</span>
        </div>
        <div class="progress-track" style="margin-top: 0.2rem">
          <div class="progress-fill success" [style.width.%]="completionRate()"></div>
        </div>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Overdue Items</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ overdueCount() }}</span>
          @if (overdueCount() > 0) {
            <span class="tag tag-danger"><span class="tag-dot"></span>Action Needed</span>
          } @else {
            <span class="tag tag-success"><span class="tag-dot"></span>On Track</span>
          }
        </div>
        <span class="kpi-hint">Past due open deliverables</span>
      </div>
    </section>

    <div class="split-layout">
      <section class="card">
        <div class="card-header">
          <h2 class="card-title">Assigned Interns ({{ interns().length }})</h2>
          @if (selectedInternId() !== null) {
            <button type="button" class="btn btn-ghost btn-sm" (click)="selectedInternId.set(null)">
              Show All
            </button>
          }
        </div>

        @if (loading()) {
          <div class="empty-state">Loading cohort...</div>
        } @else if (interns().length === 0) {
          <div class="empty-state">
            <h3>No interns assigned</h3>
            <p>Interns assigned to you by an administrator will appear here.</p>
          </div>
        } @else {
          <div class="roster-list">
            @for (intern of interns(); track intern.id) {
              <button
                type="button"
                class="roster-item"
                [class.selected]="selectedInternId() === intern.id"
                (click)="toggleIntern(intern.id)"
              >
                <div class="entity-cell">
                  <div class="initials-chip">{{ intern.name[0] }}{{ intern.lastname[0] }}</div>
                  <div style="text-align: left; min-width: 0">
                    <div class="cell-primary">{{ intern.name }} {{ intern.lastname }}</div>
                    <div class="cell-secondary">{{ intern.university || intern.email }}</div>
                  </div>
                </div>
                <div class="roster-meta">
                  <span class="tag tag-accent">{{ intern.discipline }}</span>
                  <span class="mono">
                    {{ internProgress(intern.id).done }}/{{ internProgress(intern.id).total }} done
                  </span>
                </div>
                <div class="progress-track">
                  <div
                    class="progress-fill success"
                    [style.width.%]="internProgress(intern.id).percent"
                  ></div>
                </div>
              </button>
            }
          </div>
        }
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">{{ activeTaskHeading() }}</h2>
            <span class="card-meta">{{ filteredTasks().length }} matching records</span>
          </div>
          <div class="segmented">
            <button
              type="button"
              class="segmented-btn"
              [class.active]="taskFilter() === 'all'"
              (click)="taskFilter.set('all')"
            >
              All
            </button>
            <button
              type="button"
              class="segmented-btn"
              [class.active]="taskFilter() === 'pending'"
              (click)="taskFilter.set('pending')"
            >
              In Progress
            </button>
            <button
              type="button"
              class="segmented-btn"
              [class.active]="taskFilter() === 'completed'"
              (click)="taskFilter.set('completed')"
            >
              Completed
            </button>
            <button
              type="button"
              class="segmented-btn"
              [class.active]="taskFilter() === 'overdue'"
              (click)="taskFilter.set('overdue')"
            >
              Overdue
            </button>
          </div>
        </div>

        @if (filteredTasks().length === 0) {
          <div class="empty-state">
            <h3>No tasks match this filter</h3>
            <p>Click "Assign Task" to delegate a catalog item to an intern.</p>
          </div>
        } @else {
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Deliverable</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th style="text-align: right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (task of filteredTasks(); track task.id) {
                  <tr>
                    <td class="record-id">TSK-{{ pad(task.id) }}</td>
                    <td style="max-width: 340px">
                      <div class="cell-primary">{{ task.title }}</div>
                      <div class="cell-secondary">{{ task.description }}</div>
                    </td>
                    <td>{{ internName(task.assignedToId) }}</td>
                    <td>
                      <div class="mono">{{ task.deadline | date: 'yyyy-MM-dd' }}</div>
                      <div class="cell-secondary">Start {{ task.startDate | date: 'MMM d' }}</div>
                    </td>
                    <td>
                      @if (task.isCompleted) {
                        <span class="tag tag-success"><span class="tag-dot"></span>Completed</span>
                      } @else if (isOverdue(task)) {
                        <span class="tag tag-danger"><span class="tag-dot"></span>Overdue</span>
                      } @else {
                        <span class="tag tag-warning"><span class="tag-dot"></span>In Progress</span>
                      }
                    </td>
                    <td>
                      <div class="row-actions">
                        <button type="button" class="btn btn-secondary btn-sm" (click)="openEditModal(task)">
                          Edit
                        </button>
                        <button type="button" class="btn btn-danger-outline btn-sm" (click)="deleteTask(task)">
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
    </div>

    @if (showTaskModal()) {
      <div class="modal-backdrop" (click)="showTaskModal.set(false)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingTaskId() ? 'Edit Assigned Task' : 'Assign Task to Intern' }}</h2>
            <button type="button" class="btn btn-ghost btn-sm" (click)="showTaskModal.set(false)">×</button>
          </div>
          <form (ngSubmit)="submitTask()">
            <div class="modal-body form-grid">
              <div class="field span-2">
                <label>Assignee (Intern) *</label>
                <select class="select" name="assignedToId" required [(ngModel)]="taskForm.assignedToId">
                  @for (intern of interns(); track intern.id) {
                    <option [ngValue]="intern.id">
                      {{ intern.name }} {{ intern.lastname }} ({{ intern.discipline }})
                    </option>
                  }
                </select>
              </div>
              <div class="field span-2">
                <label>Catalog Template *</label>
                <select class="select" name="assignmentId" required [(ngModel)]="taskForm.assignmentId">
                  @for (a of assignments(); track a.id) {
                    <option [ngValue]="a.id">[{{ a.taskType }}] {{ a.title }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>Start Date *</label>
                <input class="input mono" type="date" name="startDate" required [(ngModel)]="taskForm.startDate" />
              </div>
              <div class="field">
                <label>Deadline *</label>
                <input class="input mono" type="date" name="deadline" required [(ngModel)]="taskForm.deadline" />
              </div>
              @if (editingTaskId()) {
                <div class="field span-2">
                  <label class="checkbox-row">
                    <input type="checkbox" name="isCompleted" [(ngModel)]="taskForm.isCompleted" />
                    <span>Mark deliverable as completed</span>
                  </label>
                </div>
              }
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showTaskModal.set(false)">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                {{ saving() ? 'Saving...' : editingTaskId() ? 'Save Changes' : 'Assign Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: `
    .split-layout {
      display: grid;
      grid-template-columns: 310px minmax(0, 1fr);
      gap: 1.15rem;
      align-items: start;

      @media (max-width: 1060px) {
        grid-template-columns: 1fr;
      }
    }

    .roster-list {
      display: flex;
      flex-direction: column;
    }

    .roster-item {
      width: 100%;
      border: none;
      border-bottom: 1px solid var(--border);
      background: transparent;
      padding: 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: var(--surface-hover);
      }

      &.selected {
        background: var(--accent-soft);
        box-shadow: inset 3px 0 0 var(--accent);
      }
    }

    .roster-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-soft);
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
  `,
})
export class MentorDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly interns = signal<InternItem[]>([]);
  protected readonly assignments = signal<AssignmentItem[]>([]);
  protected readonly tasksByIntern = signal<Record<number, InternTaskItem[]>>({});
  protected readonly selectedInternId = signal<number | null>(null);
  protected readonly taskFilter = signal<TaskFilter>('all');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly showTaskModal = signal(false);
  protected readonly editingTaskId = signal<number | null>(null);

  protected taskForm = {
    assignedToId: 0,
    assignmentId: 0,
    startDate: new Date().toISOString().slice(0, 10),
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    isCompleted: false,
  };

  protected readonly allTasks = computed(() => Object.values(this.tasksByIntern()).flat());
  protected readonly completedCount = computed(
    () => this.allTasks().filter((t) => t.isCompleted).length
  );
  protected readonly overdueCount = computed(
    () => this.allTasks().filter((t) => this.isOverdue(t)).length
  );
  protected readonly completionRate = computed(() => {
    const total = this.allTasks().length;
    return total ? Math.round((this.completedCount() / total) * 100) : 0;
  });

  protected readonly activeTaskHeading = computed(() => {
    const id = this.selectedInternId();
    if (id === null) return 'Task Ledger — All Assigned Interns';
    return `Task Ledger — ${this.internName(id)}`;
  });

  protected readonly filteredTasks = computed(() => {
    const id = this.selectedInternId();
    const list = id === null ? this.allTasks() : (this.tasksByIntern()[id] ?? []);
    const filter = this.taskFilter();
    return list.filter((t) => {
      if (filter === 'completed') return t.isCompleted;
      if (filter === 'pending') return !t.isCompleted;
      if (filter === 'overdue') return this.isOverdue(t);
      return true;
    });
  });

  protected pad(id: number): string {
    return String(id).padStart(4, '0');
  }

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    const mentorId = this.auth.currentUser()?.id;
    if (!mentorId) return;
    this.loading.set(true);
    try {
      const [interns, assignments] = await Promise.all([
        this.api.getInternsByMentorId(mentorId),
        this.api.getAllAssignments(),
      ]);
      this.interns.set(interns);
      this.assignments.set(assignments);

      const entries = await Promise.all(
        interns.map(async (i) => [i.id, await this.api.getTasksByInternId(i.id)] as const)
      );
      const map: Record<number, InternTaskItem[]> = {};
      for (const [id, tasks] of entries) {
        map[id] = tasks;
      }
      this.tasksByIntern.set(map);
    } catch {
      this.toast.error('Failed to load mentor operations data.');
    } finally {
      this.loading.set(false);
    }
  }

  protected toggleIntern(internId: number): void {
    this.selectedInternId.set(this.selectedInternId() === internId ? null : internId);
  }

  protected internName(internId: number): string {
    const found = this.interns().find((i) => i.id === internId);
    return found ? `${found.name} ${found.lastname}` : `Intern #${internId}`;
  }

  protected internProgress(internId: number): { done: number; total: number; percent: number } {
    const list = this.tasksByIntern()[internId] ?? [];
    const done = list.filter((t) => t.isCompleted).length;
    const total = list.length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  protected isOverdue(task: InternTaskItem): boolean {
    return !task.isCompleted && new Date(task.deadline).getTime() < Date.now();
  }

  protected openAssignModal(): void {
    this.editingTaskId.set(null);
    this.taskForm = {
      assignedToId: this.selectedInternId() ?? this.interns()[0]?.id ?? 0,
      assignmentId: this.assignments()[0]?.id ?? 0,
      startDate: new Date().toISOString().slice(0, 10),
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      isCompleted: false,
    };
    this.showTaskModal.set(true);
  }

  protected openEditModal(task: InternTaskItem): void {
    this.editingTaskId.set(task.id);
    this.taskForm = {
      assignedToId: task.assignedToId,
      assignmentId: task.assignmentId || this.assignments()[0]?.id || 0,
      startDate: task.startDate.slice(0, 10),
      deadline: task.deadline.slice(0, 10),
      isCompleted: task.isCompleted,
    };
    this.showTaskModal.set(true);
  }

  protected async submitTask(): Promise<void> {
    const mentorId = this.auth.currentUser()?.id;
    if (!mentorId) return;
    this.saving.set(true);
    try {
      const editId = this.editingTaskId();
      if (editId) {
        await this.api.updateInternTask({
          id: editId,
          assignedToId: this.taskForm.assignedToId,
          assignedById: mentorId,
          assignmentId: this.taskForm.assignmentId,
          startDate: new Date(this.taskForm.startDate).toISOString(),
          deadline: new Date(this.taskForm.deadline).toISOString(),
          isCompleted: this.taskForm.isCompleted,
          completedAt: this.taskForm.isCompleted ? new Date().toISOString() : null,
        });
        this.toast.success('Task updated.');
      } else {
        await this.api.createInternTask({
          assignedToId: this.taskForm.assignedToId,
          assignedById: mentorId,
          assignmentId: this.taskForm.assignmentId,
          startDate: new Date(this.taskForm.startDate).toISOString(),
          deadline: new Date(this.taskForm.deadline).toISOString(),
          isCompleted: false,
        });
        this.toast.success('Task assigned to intern.');
      }
      this.showTaskModal.set(false);
      await this.load();
    } catch {
      this.toast.error('Failed to save task.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async deleteTask(task: InternTaskItem): Promise<void> {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    try {
      await this.api.deleteInternTask(task.id);
      this.toast.success('Task deleted.');
      await this.load();
    } catch {
      this.toast.error('Failed to delete task.');
    }
  }
}
