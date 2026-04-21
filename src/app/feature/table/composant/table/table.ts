import {Component, inject, OnInit, signal} from '@angular/core';
import {EmpruntService} from '../../../../core/services/emprunt/emprunt.service';
import {Emprunts} from '../../../../core/models/emprunt';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnInit{

  empruntService = inject(EmpruntService);
  empruntsActif = signal<Emprunts[]>([]);

  ngOnInit () {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe(data => {
      this.empruntsActif.set(data);
    });
  }

}
