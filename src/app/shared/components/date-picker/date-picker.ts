
import {Component, input, output, computed, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePicker {
  dateFin = input<string>('');
  code = input<string>('');
  date = signal('');

  dateSelect = output<string>();
  cancel = output<void>();

  erreur = computed(() => {
    if (!this.date || !this.dateFin()) return null;

    const dateSelectionnee = new Date(this.date());
    const dateFinEmprunt = new Date(this.dateFin());

    if (this.code() === 'DEMANDE_PROLONGATION' && dateSelectionnee <= dateFinEmprunt) {
      return 'La date doit être supérieure à la date de fin de l\'emprunt';
    }
    if (this.code() === 'DEMANDE_RETOUR_ANTICIPE' && dateSelectionnee >= dateFinEmprunt) {
      return 'La date doit être inférieure à la date de fin de l\'emprunt';
    }
    return null;
  });

  onConfirm(): void {
    if (this.date && !this.erreur()) this.dateSelect.emit(this.date());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
