import {Component, computed, ElementRef, input, output, ViewChild,} from '@angular/core';
import {ColonneConfig} from '../../models/colonne-config.model';
import {FormsModule} from '@angular/forms';
import {DecisionEvent} from '../../models/decision-event.model';




@Component({
  selector: 'app-table',
  imports: [
    FormsModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
})

export class Table {

  titre  = input<string>('');
  colonnes = input<ColonneConfig[]>([]);
  data   = input<any[]>([]);
  showAction = input<boolean>(true);
  showEditDelete = input<boolean>(true);
  tableActions = input<any[]>([]);
  showNote = input<boolean>(false);
  actionPlaceholder = input<string>('— Décision —');

  decisionChange = output<DecisionEvent>();
  edit           = output<any>();
  delete         = output<any>();

  visibleColonnes = computed(() => {
    const rows = this.data();

    return this.colonnes().filter(col => {
      if (col.key === 'dateProlongation') {
        return rows.some(r => r.dateProlongation);
      }

      if (col.key === 'dateRetourAnticipe') {
        return rows.some(r => r.dateRetourAnticipe);
      }

      return true;
    });
  });

  onActionChange(row: any, event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    const actionId = selectElement?.value ?? '';

    if (!actionId) {
      return;
    }

    const action = this.tableActions().find((item) => String(item.id) === String(actionId));
    if (!action) {
      return;
    }

    this.decisionChange.emit({ rowId: row.id, statutId : action.id, code: action.code });
    setTimeout(() => {
      row.__selectedActionId = '';
      if (selectElement) {
        selectElement.value = '';
      }
    }, 0);
  }


  onEdit(row: any): void   { this.edit.emit(row); }
  onDelete(row: any): void { this.delete.emit(row); }


  @ViewChild('tableScroll') tableScrollRef!: ElementRef<HTMLDivElement>;


  ngAfterViewInit() {
    if (this.tableScrollRef) {
      this.tableScrollRef.nativeElement.scrollLeft = 0;
    }
  }

  getValeur(row: any, key: string): any {

    const value = key.split('.').reduce((obj, k) => obj?.[k], row);

    const champsDate = [
      'dateCreation',
      'dateDebut',
      'dateFin',
      'dateProlongation',
      'dateRetourAnticipe'
    ];

    if (champsDate.includes(key) && value && !isNaN(Date.parse(value))) {
      return new Date(value).toLocaleDateString('fr-FR');
    }

    return value;
  }

}
