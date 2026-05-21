import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layouts/header/header';
import { Sidebar } from './core/layouts/sidebar/sidebar';
import { Footer } from './core/layouts/footer/footer';
import {NotificationService} from './core/services/notification/notification.service';
import {ModaleConfirmation} from './shared/components/modale-confirmation/modale-confirmation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer, ModaleConfirmation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('locmns-frontend');

  notificationService = inject(NotificationService);

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
