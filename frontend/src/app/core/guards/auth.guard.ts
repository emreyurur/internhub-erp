import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/domain.models';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser();
  if (!user) return true;
  if (user.role === 'Admin') return router.createUrlTree(['/admin']);
  if (user.role === 'Mentor') return router.createUrlTree(['/mentor']);
  return router.createUrlTree(['/intern']);
};

export function roleGuard(allowed: Role[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();
    if (!user) return router.createUrlTree(['/login']);
    if (allowed.includes(user.role)) return true;
    if (user.role === 'Admin') return router.createUrlTree(['/admin']);
    if (user.role === 'Mentor') return router.createUrlTree(['/mentor']);
    return router.createUrlTree(['/intern']);
  };
}

