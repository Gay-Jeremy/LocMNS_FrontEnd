import {Injectable, inject, signal, WritableSignal} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toastr = inject(ToastrService);
  readonly modaleVisible = signal(false);
  readonly modaleConfig = signal({ titre: '', message: '' });
  private resolveConfirm!: (value: boolean) => void

  success(message: string, title = 'Succès'): void {
    this.toastr.success(message, title);
  }

  error(message: string, title = 'Erreur'): void {
    this.toastr.error(message, title);
  }

  warning(message: string, title = 'Attention'): void {
    this.toastr.warning(message, title);
  }

  info(message: string, title = 'Information'): void {
    this.toastr.info(message, title);
  }

  confirm(message: string, titre = 'Confirmation'): Promise<boolean> {
    this.modaleConfig.set({ titre, message });
    this.modaleVisible.set(true);
    return new Promise((resolve) => (this.resolveConfirm = resolve));
  }

  onConfirmer(): void {
    this.modaleVisible.set(false);
    this.resolveConfirm(true);
  }

  onAnnuler(): void {
    this.modaleVisible.set(false);
    this.resolveConfirm(false);
  }

  /** Affiche le message d'une erreur HTTP ou d'une exception. */
  fromHttpError(error: unknown, fallback = 'Une erreur est survenue'): void {
    this.error(this.extractMessage(error, fallback));
  }

  /** Erreur 400 avec champs de validation renvoyés par le backend. */
  isValidationError(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse) || error.status !== 400) {
      return false;
    }
    const body = error.error;
    return typeof body === 'object' && body !== null && !Array.isArray(body);
  }

  /** Remplit le signal d'erreurs par champ ; retourne true si traité. */
  applyFieldErrors(error: unknown, erreurs: WritableSignal<Record<string, string>>): boolean {
    if (!this.isValidationError(error)) {
      return false;
    }
    erreurs.set((error as HttpErrorResponse).error as Record<string, string>);
    return true;
  }

  private extractMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      // Les statuts au sens fixe passent en premier, avant le message technique du back
      if (error.status === 0) {
        return 'Impossible de joindre le serveur';
      }
      if (error.status === 401) {
        return 'Session expirée, veuillez vous reconnecter';
      }
      if (error.status === 403) {
        return 'Accès refusé';
      }
      if (error.status === 409) {
        return 'Impossible de supprimer ce matériel : il est lié à un emprunt.';
      }

      // Sinon, on tente de récupérer un message précis renvoyé par le back (validation, etc.)
      const body = error.error;
      if (typeof body === 'string' && body.trim()) {
        return body;
      }
      if (body && typeof body === 'object') {
        const record = body as Record<string, unknown>;
        const msg = record['message'] ?? record['error'] ?? record['detail'];
        if (typeof msg === 'string' && msg.trim()) {
          return msg;
        }
      }
    }
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }
}
