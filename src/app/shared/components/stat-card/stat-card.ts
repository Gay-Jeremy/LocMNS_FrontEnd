import {Component, input} from '@angular/core';
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

  route     = input<string>('');
  nomLabel  = input<string>('');
  cptValeur = input<number>(0);
  btnLabel  = input<string>('');
  queryParams = input<{ [key: string]: string }>({});
}
