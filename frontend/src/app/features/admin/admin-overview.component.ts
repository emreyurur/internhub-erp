import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { AssignmentItem, Discipline, InternItem, MentorItem } from '../../core/models/domain.models';

@Component({
  selector: 'app-admin-overview',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Executive Overview</h1>
        <p class="page-subtitle">
          Real-time headcount, mentor coverage, and assignment catalog metrics across the organization.
        </p>
      </div>
      <div class="header-actions">
        <a routerLink="/admin/mentors" class="btn btn-secondary">Manage Mentors</a>
        <a routerLink="/admin/interns" class="btn btn-primary">+ Register Intern</a>
      </div>
    </div>

    <section class="kpi-strip" aria-label="Key metrics">
      <div class="kpi-cell">
        <span class="kpi-label">Active Interns</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ interns().length }}</span>
          <span class="tag tag-success"><span class="tag-dot"></span>Active</span>
        </div>
        <span class="kpi-hint">{{ assignedInternCount() }} paired with a mentor</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Engineering Mentors</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ mentors().length }}</span>
        </div>
        <span class="kpi-hint">Avg {{ avgInternsPerMentor() }} interns per mentor</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Assignment Catalog</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ assignments().length }}</span>
        </div>
        <span class="kpi-hint">Project, Domain &amp; Meeting templates</span>
      </div>

      <div class="kpi-cell">
        <span class="kpi-label">Mentor Coverage</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ mentorCoveragePercent() }}%</span>
        </div>
        <div class="progress-track" style="margin-top: 0.2rem">
          <div class="progress-fill success" [style.width.%]="mentorCoveragePercent()"></div>
        </div>
      </div>
    </section>

    <div class="overview-grid">
      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Recent Intern Roster</h2>
            <span class="card-meta">Latest registered cohort records</span>
          </div>
          <a routerLink="/admin/interns" class="btn btn-secondary btn-sm">View All Records</a>
        </div>

        @if (loading()) {
          <div class="empty-state">Loading organization records...</div>
        } @else if (interns().length === 0) {
          <div class="empty-state">
            <h3>No intern records found</h3>
            <p>Register an intern to populate the workforce directory.</p>
          </div>
        } @else {
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Intern</th>
                  <th>Discipline</th>
                  <th>Assigned Mentor</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                @for (intern of interns().slice(0, 6); track intern.id) {
                  <tr>
                    <td class="record-id">INT-{{ pad(intern.id) }}</td>
                    <td>
                      <div class="entity-cell">
                        <div class="initials-chip">{{ intern.name[0] }}{{ intern.lastname[0] }}</div>
                        <div>
                          <div class="cell-primary">{{ intern.name }} {{ intern.lastname }}</div>
                          <div class="cell-secondary">{{ intern.university || intern.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="tag tag-accent">{{ intern.discipline }}</span></td>
                    <td>
                      @if (intern.mentorName) {
                        <span>{{ intern.mentorName }}</span>
                      } @else {
                        <span class="tag tag-warning"><span class="tag-dot"></span>Unassigned</span>
                      }
                    </td>
                    <td class="mono">{{ intern.endDate ? (intern.endDate | date: 'yyyy-MM-dd') : '—' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Discipline Allocation</h2>
            <span class="card-meta">Headcount &amp; mentor capacity by track</span>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Interns</th>
                <th>Mentors</th>
                <th style="width: 34%">Share</th>
              </tr>
            </thead>
            <tbody>
              @for (row of disciplineBreakdown(); track row.discipline) {
                <tr>
                  <td class="cell-primary">{{ row.discipline }}</td>
                  <td class="mono">{{ row.internCount }}</td>
                  <td class="mono">{{ row.mentorCount }}</td>
                  <td>
                    <div class="share-cell">
                      <div class="progress-track">
                        <div class="progress-fill" [style.width.%]="row.percent"></div>
                      </div>
                      <span class="mono">{{ row.percent }}%</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: `
    .overview-grid {
      display: grid;
      grid-template-columns: 1.55fr 1fr;
      gap: 1.15rem;
      align-items: start;

      @media (max-width: 1060px) {
        grid-template-columns: 1fr;
      }
    }

    .share-cell {
      display: flex;
      align-items: center;
      gap: 0.55rem;

      .mono {
        min-width: 32px;
        text-align: right;
        color: var(--text-soft);
      }
    }
  `,
})
export class AdminOverviewComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly interns = signal<InternItem[]>([]);
  protected readonly mentors = signal<MentorItem[]>([]);
  protected readonly assignments = signal<AssignmentItem[]>([]);
  protected readonly loading = signal(true);

  protected readonly assignedInternCount = computed(
    () => this.interns().filter((i) => i.mentorId != null).length
  );

  protected readonly mentorCoveragePercent = computed(() => {
    const total = this.interns().length;
    if (total === 0) return 0;
    return Math.round((this.assignedInternCount() / total) * 100);
  });

  protected readonly avgInternsPerMentor = computed(() => {
    const mCount = this.mentors().length;
    if (mCount === 0) return '0.0';
    return (this.interns().length / mCount).toFixed(1);
  });

  protected readonly disciplineBreakdown = computed(() => {
    const all: Discipline[] = ['Frontend', 'Backend', 'Ios', 'Android', 'BusinessAnalyst'];
    const total = this.interns().length || 1;
    return all.map((discipline) => {
      const internCount = this.interns().filter((i) => i.discipline === discipline).length;
      const mentorCount = this.mentors().filter((m) => m.discipline === discipline).length;
      return {
        discipline,
        internCount,
        mentorCount,
        percent: Math.round((internCount / total) * 100),
      };
    });
  });

  protected pad(id: number): string {
    return String(id).padStart(4, '0');
  }

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [interns, mentors, assignments] = await Promise.all([
        this.api.getAllInterns(),
        this.api.getAllMentors(),
        this.api.getAllAssignments(),
      ]);
      this.interns.set(interns);
      this.mentors.set(mentors);
      this.assignments.set(assignments);
    } catch {
      this.toast.error('Failed to load overview metrics. Verify backend availability.');
    } finally {
      this.loading.set(false);
    }
  }
}
