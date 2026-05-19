import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {

  readonly connected = signal(false);
  httpClient = inject(HttpClient);

  login(credentials: { email: string; password: string }) {
    return this.httpClient.post(
      'http://localhost:8080/login',
      credentials,
      { responseType: 'text' }
    ).pipe(
      tap((jwt) => {
        localStorage.setItem('jwt', jwt);
        this.connected.set(true);
      })
    );
  }
}
