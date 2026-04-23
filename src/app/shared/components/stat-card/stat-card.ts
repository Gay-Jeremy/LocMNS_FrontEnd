import {Component, Input, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-stat-card',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {

  @Input() route: string = ""
  @Input() nomLabel: string = ""
  @Input() cptValeur: string = ""
  @Input() btnLabel: string = ""

}
