import {Component, ElementRef, input, output, ViewChild,} from '@angular/core';
import {ColonneConfig} from '../../models/colonne-config.model';
import {FormsModule} from '@angular/forms';
import {TableActionModel} from '../../models/table-action.model';
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

  onActionChange(row: any, statutId: number): void {
    row.action = statutId;
    this.decisionChange.emit({ rowId: row.id, statutId });
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
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

}
