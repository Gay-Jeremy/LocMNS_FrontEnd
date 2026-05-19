import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  formBuilder = inject(FormBuilder);
  httpClient = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  loginError: string | null = null;
  loginSuccess: string | null = null;

  formulaire = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onLogin(): void {
    this.loginError = null;
    this.loginSuccess = null;

    if (this.formulaire.valid) {
      this.httpClient.post(
        'http://localhost:8080/login',
        this.formulaire.value,
        { responseType: 'text' }
      ).subscribe({
        next: (jwt) => {
          localStorage.setItem('jwt', jwt);
          this.loginSuccess = 'Connexion réussie !';
          this.cdr.detectChanges();
        },
        error: () => {
          this.loginError = 'Mauvais login / mot de passe';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.formulaire.markAllAsTouched();
    }
  }
}
