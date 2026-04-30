import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild,} from '@angular/core';
import {ColonneConfig} from '../../models/colonne-config.model';
import {FormsModule} from '@angular/forms';




@Component({
  selector: 'app-table',
  imports: [
    FormsModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.css',
})

export class Table {

  @Input() titre : string = "";
  @Input() colonnes: ColonneConfig[] = [];
  @Input() data : any[] = [];



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
