import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-stat-card',
  imports: [
    RouterLink
  ],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {

  @Input() route: string = ""
  @Input() nomLabel: string = ""
  @Input() cptValeur: number = 0
  @Input() btnLabel: string = ""

}
