import {Component, input} from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {

  nomLabel = input.required<string>()
  cptValeur = input.required<number>()
  btnLabel = input.required<string>()
}
