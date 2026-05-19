import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/authentification/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  authService = inject(Auth);
  formBuilder = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);

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
      this.authService
        .login(this.formulaire.value as { email: string; password: string })
        .subscribe({
          next: (jwt) => {
            this.loginSuccess = 'Connexion réussie !';
            this.cdr.detectChanges();
            setTimeout(() => this.router.navigate(['/accueil']), 1500);
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
