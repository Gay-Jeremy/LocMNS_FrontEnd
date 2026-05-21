import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-modale-confirmation',
  imports: [],
  templateUrl: './modale-confirmation.html',
  styleUrl: './modale-confirmation.css',
})

export class ModaleConfirmation {
  @Input() titre = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ?';
  @Input() labelConfirmer = 'Confirmer';
  @Input() labelAnnuler = 'Annuler';

  @Output() confirmer = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

}
