import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


export const canActivateGuardPublic: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
  return checkAuthStatus();
};

export const canMatchGuardPublic: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  return checkAuthStatus();
};

const checkAuthStatus = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuth()
    .pipe(
      tap(isAuthenticated => console.log('Authenticated: ', isAuthenticated)),
      tap(isAuthenticated => {
        if (isAuthenticated) {
          router.navigate(['./']);
        }
      }),
      map(isAuthentiCated => !isAuthentiCated )
    );
}
