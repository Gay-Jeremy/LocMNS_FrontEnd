import {computed, inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

type JwtInfo = {sub: string, role: string};
@Injectable({ providedIn: 'root' })
export class Auth {

  readonly jwtInfo = signal<JwtInfo | null>(null);

  readonly isAdmin = computed(() => this.jwtInfo()?.role === 'Administrateur');

  httpClient = inject(HttpClient);

  constructor() {
    this.decodeJwt() }

  login(credentials: { email: string; password: string }) {
    return this.httpClient.post(
      'http://localhost:8080/login',
      credentials,
      { responseType: 'text' }
    ).pipe(
      tap((jwt) => {
        localStorage.setItem('jwt', jwt);
        this.decodeJwt()
      })
    );
  }

  decodeJwt() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      const jwtParts = jwt.split('.');
      const bodyBase64 = jwtParts[1];
      const base64 = bodyBase64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const bodyJson = atob(padded);
      const body = JSON.parse(bodyJson);
      this.jwtInfo.set(body);
    }
  }
}
