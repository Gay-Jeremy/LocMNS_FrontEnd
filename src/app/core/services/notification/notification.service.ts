import {Injectable, inject, signal} from '@angular/core';
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

  private extractMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
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
      if (error.status === 0) {
        return 'Impossible de joindre le serveur';
      }
      if (error.status === 401) {
        return 'Identifiants incorrects';
      }
      if (error.status === 403) {
        return 'Accès refusé';
      }
    }
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }
}
