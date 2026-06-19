import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/authentification/auth.service';
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  notifications = inject(NotificationService);

  formulaire = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onLogin(): void {
    if (this.formulaire.valid) {
      this.authService
        .login(this.formulaire.value as { email: string; password: string })
        .subscribe({
          next: () => {
            this.notifications.success('Connexion réussie');
            setTimeout(() => this.router.navigate(['/accueil']), 300);
          },
          error: (err) => {
            this.notifications.fromHttpError(err, 'Mauvais login / mot de passe');
          },
        });
    } else {
      this.formulaire.markAllAsTouched();
      this.notifications.warning('Veuillez corriger les champs du formulaire');
    }
  }
}
