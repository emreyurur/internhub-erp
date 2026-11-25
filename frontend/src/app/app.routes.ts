import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { ShellComponent } from './layout/shell.component';
import { AdminOverviewComponent } from './features/admin/admin-overview.component';
import { InternsManagementComponent } from './features/admin/interns-management.component';
import { MentorsManagementComponent } from './features/admin/mentors-management.component';
import { AssignmentsManagementComponent } from './features/assignments/assignments-management.component';
import { MentorDashboardComponent } from './features/mentor/mentor-dashboard.component';
import { InternDashboardComponent } from './features/intern/intern-dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [roleGuard(['Admin'])],
        children: [
          { path: '', component: AdminOverviewComponent },
          { path: 'interns', component: InternsManagementComponent },
          { path: 'mentors', component: MentorsManagementComponent },
          { path: 'assignments', component: AssignmentsManagementComponent },
        ],
      },
      {
        path: 'mentor',
        canActivate: [roleGuard(['Mentor'])],
        children: [
          { path: '', component: MentorDashboardComponent },
          { path: 'assignments', component: AssignmentsManagementComponent },
        ],
      },
      {
        path: 'intern',
        canActivate: [roleGuard(['Intern'])],
        component: InternDashboardComponent,
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
