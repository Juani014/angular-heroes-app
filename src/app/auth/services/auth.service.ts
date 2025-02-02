import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environments } from '../../environments/environments';
import { User } from '../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl: string = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<User> {
    //http.post('login', {email, password});
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(myUser => this.user = myUser),
        tap(myUser => localStorage.setItem('token', 'sdafasdfsda.156fdg32.dfgojih484xdd'))
      );
  }

  checkAuth(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(myUser => this.user = myUser),
        map(user => !!user),
        catchError(e => of(false))
      );
  }

  logout(): void{
    this.user = undefined;
    localStorage.clear();
  }

}
