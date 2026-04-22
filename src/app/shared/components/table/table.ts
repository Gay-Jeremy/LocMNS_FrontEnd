import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {EmpruntService} from '../../../core/services/emprunt/emprunt.service';
import {Emprunts} from '../../../core/models/emprunt';
import {Materiel} from '../../../core/models/materiel';
import {Utilisateur} from '../../../core/models/utilisateur';
import {ColonneConfig} from '../../models/colonne-config.model';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {


  @Input() colonnes: ColonneConfig[] = [];
  @Input() data : any[] = [];


  getValeur(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

}
