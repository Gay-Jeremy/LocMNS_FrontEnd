import {Component, Output, EventEmitter, inject} from '@angular/core';
import {AuthService} from '../../services/authentification/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() burgerClick = new EventEmitter<void>();

  authService = inject(AuthService)

  onBurgerClick() {
    this.burgerClick.emit();
  }
}
