import {Component, inject} from '@angular/core';
import {EmpruntService} from '../../services/emprunt/emprunt.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  empruntService = inject(EmpruntService)

}
