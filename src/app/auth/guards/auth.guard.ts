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
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

//No hay necesidad de crear una clase, simplemente definiendo una función flecha y
//exportándola podemos utilizar sus funcionalidades de guard en el app-routing
export const canActivateGuard: CanActivateFn = ( //Hay que tener en cuenta el tipado CanActiveFn
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
  return checkAuthStatus();
};

export const canMatchGuard: CanMatchFn = ( //Tipado CanMatchFN
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
        if (!isAuthenticated) {
          router.navigate(['./auth/login']);
        }
      }),
    );
}
