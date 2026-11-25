import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InternProfile, InternTaskDetail, InternTaskItem } from '../../core/models/domain.models';

type InternFilter = 'all' | 'pending' | 'completed' | 'overdue';

@Component({
  selector: 'app-intern-dashboard',
  imports: [DatePipe],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Intern Portal</h1>
        <p class="page-subtitle">
          Track assigned deliverables, review specifications, and report task completion.
        </p>
      </div>
    </div>

    @if (profile()) {
      <section class="card record-banner">
        <div class="entity-cell">
          <div class="banner-avatar">{{ profile()!.name[0] }}{{ profile()!.lastname[0] }}</div>
          <div>
            <div class="banner-name">
              {{ profile()!.name }} {{ profile()!.lastname }}
              <span class="record-id">INT-{{ pad(profile()!.id) }}</span>
            </div>
            <div class="cell-secondary">{{ profile()!.email }} · {{ profile()!.department }}</div>
          </div>
        </div>

        <div class="mentor-block">
          <span class="mentor-caption">Reporting Mentor</span>
          <div class="mentor-value">
            <strong>{{ profile()!.mentorName }} {{ profile()!.mentorLastname }}</strong>
            <span class="tag tag-accent">{{ profile()!.mentorDiscipline }}</span>
          </div>
        </div>
      </section>
    }

    <section class="kpi-strip">
      <div class="kpi-cell">
        <span class="kpi-label">Total Deliverables</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ tasks().length }}</span>
        </div>
        <div class="progress-track" style="margin-top: 0.2rem">
          <div class="progress-fill success" [style.width.%]="completionRate()"></div>
        </div>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Completed</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ completedCount() }}</span>
          <span class="kpi-hint mono">{{ completionRate() }}%</span>
        </div>
        <span class="kpi-hint">Verified deliverables</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">In Progress</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ pendingCount() }}</span>
        </div>
        <span class="kpi-hint">Active open items</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Overdue</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ overdueCount() }}</span>
          @if (overdueCount() > 0) {
            <span class="tag tag-danger"><span class="tag-dot"></span>Priority</span>
          } @else {
            <span class="tag tag-success"><span class="tag-dot"></span>Clear</span>
          }
        </div>
        <span class="kpi-hint">Past due deadline</span>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Assigned Deliverables</h2>
          <span class="card-meta">Showing {{ filteredTasks().length }} of {{ tasks().length }} tasks</span>
        </div>
        <div class="segmented">
          <button
            type="button"
            class="segmented-btn"
            [class.active]="filter() === 'all'"
            (click)="filter.set('all')"
          >
            All
          </button>
          <button
            type="button"
            class="segmented-btn"
            [class.active]="filter() === 'pending'"
            (click)="filter.set('pending')"
          >
            In Progress
          </button>
          <button
            type="button"
            class="segmented-btn"
            [class.active]="filter() === 'completed'"
            (click)="filter.set('completed')"
          >
            Completed
          </button>
          <button
            type="button"
            class="segmented-btn"
            [class.active]="filter() === 'overdue'"
            (click)="filter.set('overdue')"
          >
            Overdue
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="empty-state">Loading assigned deliverables...</div>
      } @else if (filteredTasks().length === 0) {
        <div class="empty-state">
          <h3>No deliverables in this view</h3>
          <p>Tasks delegated by your mentor will appear here.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Deliverable</th>
                <th>Category</th>
                <th>Schedule</th>
                <th>Status</th>
                <th style="text-align: right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (task of filteredTasks(); track task.id) {
                <tr>
                  <td class="record-id">TSK-{{ pad(task.id) }}</td>
                  <td style="max-width: 400px">
                    <div class="cell-primary">{{ task.title }}</div>
                    <div class="cell-secondary">{{ task.description }}</div>
                  </td>
                  <td>
                    @if (task.taskType) {
                      <span class="tag">{{ task.taskType }}</span>
                    } @else {
                      <span class="cell-secondary">—</span>
                    }
                  </td>
                  <td>
                    <div class="mono">Due {{ task.deadline | date: 'yyyy-MM-dd' }}</div>
                    <div class="cell-secondary">
                      @if (task.completedAt) {
                        Done {{ task.completedAt | date: 'MMM d, yyyy' }}
                      } @else {
                        {{ deadlineDelta(task.deadline) }}
                      }
                    </div>
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
                      <button type="button" class="btn btn-secondary btn-sm" (click)="openDetail(task.id)">
                        Inspect
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm"
                        [class.btn-primary]="!task.isCompleted"
                        [class.btn-secondary]="task.isCompleted"
                        [disabled]="updatingId() === task.id"
                        (click)="toggleComplete(task)"
                      >
                        {{ task.isCompleted ? 'Reopen' : 'Mark Complete' }}
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

    @if (selectedDetail()) {
      <div class="modal-backdrop" (click)="selectedDetail.set(null)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Task Specification · TSK-{{ pad(selectedDetail()!.id) }}</h2>
            <button type="button" class="btn btn-ghost btn-sm" (click)="selectedDetail.set(null)">×</button>
          </div>
          <div class="modal-body detail-body">
            <div>
              <h3 class="detail-title">{{ selectedDetail()!.title }}</h3>
              <p class="detail-desc">{{ selectedDetail()!.description }}</p>
            </div>
            <div class="detail-grid">
              <div>
                <span class="detail-label">Reporting Mentor</span>
                <strong>{{ selectedDetail()!.mentorName }}</strong>
              </div>
              <div>
                <span class="detail-label">Status</span>
                <strong>{{ selectedDetail()!.isCompleted ? 'Completed' : 'In Progress' }}</strong>
              </div>
              <div>
                <span class="detail-label">Start Date</span>
                <strong class="mono">{{ selectedDetail()!.startDate | date: 'yyyy-MM-dd' }}</strong>
              </div>
              <div>
                <span class="detail-label">Deadline</span>
                <strong class="mono">{{ selectedDetail()!.deadline | date: 'yyyy-MM-dd' }}</strong>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="selectedDetail.set(null)">Close</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .record-banner {
      padding: 0.95rem 1.2rem;
      margin-bottom: 1.15rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .banner-avatar {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      background: #111827;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.85rem;
      display: grid;
      place-items: center;
    }

    .banner-name {
      font-size: 0.96rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }

    .mentor-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.2rem;

      @media (max-width: 640px) {
        align-items: flex-start;
      }
    }

    .mentor-caption {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-soft);
    }

    .mentor-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.84rem;
    }

    .detail-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-title {
      font-size: 0.96rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
    }

    .detail-desc {
      color: var(--text-muted);
      font-size: 0.84rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
      padding: 0.9rem;
      border-radius: 6px;
      background: #fafafa;
      border: 1px solid var(--border);

      div {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
    }

    .detail-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-soft);
    }
  `,
})
export class InternDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly profile = signal<InternProfile | null>(null);
  protected readonly tasks = signal<InternTaskItem[]>([]);
  protected readonly filter = signal<InternFilter>('all');
  protected readonly loading = signal(true);
  protected readonly updatingId = signal<number | null>(null);
  protected readonly selectedDetail = signal<InternTaskDetail | null>(null);

  protected readonly completedCount = computed(() => this.tasks().filter((t) => t.isCompleted).length);
  protected readonly pendingCount = computed(() => this.tasks().filter((t) => !t.isCompleted).length);
  protected readonly overdueCount = computed(
    () => this.tasks().filter((t) => this.isOverdue(t)).length
  );
  protected readonly completionRate = computed(() => {
    const total = this.tasks().length;
    return total ? Math.round((this.completedCount() / total) * 100) : 0;
  });

  protected readonly filteredTasks = computed(() => {
    const f = this.filter();
    return this.tasks().filter((t) => {
      if (f === 'completed') return t.isCompleted;
      if (f === 'pending') return !t.isCompleted;
      if (f === 'overdue') return this.isOverdue(t);
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
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.loading.set(true);
    try {
      const [profile, tasks] = await Promise.all([
        this.api.getInternProfile(userId),
        this.api.getTasksByUserId(userId),
      ]);
      this.profile.set(profile);
      this.tasks.set(tasks);
    } catch {
      this.toast.error('Failed to load intern portal records.');
    } finally {
      this.loading.set(false);
    }
  }

  protected isOverdue(task: InternTaskItem): boolean {
    return !task.isCompleted && new Date(task.deadline).getTime() < Date.now();
  }

  protected deadlineDelta(deadline: string): string {
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Due today';
    return `${diff}d remaining`;
  }

  protected async toggleComplete(task: InternTaskItem): Promise<void> {
    this.updatingId.set(task.id);
    try {
      await this.api.completeTask({ id: task.id, isCompleted: !task.isCompleted });
      this.toast.success(!task.isCompleted ? 'Deliverable marked complete.' : 'Deliverable reopened.');
      await this.load();
    } catch {
      this.toast.error('Failed to update task status.');
    } finally {
      this.updatingId.set(null);
    }
  }

  protected async openDetail(taskId: number): Promise<void> {
    try {
      const detail = await this.api.getTaskDetail(taskId);
      this.selectedDetail.set(detail);
    } catch {
      this.toast.error('Failed to load task specification.');
    }
  }
}
