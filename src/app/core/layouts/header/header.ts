import {Component, Output, EventEmitter, inject} from '@angular/core';
import {Auth} from '../../services/authentification/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() burgerClick = new EventEmitter<void>();

  authService = inject(Auth)

  onBurgerClick() {
    this.burgerClick.emit();
  }
}
