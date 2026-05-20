import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Footer} from '../../../core/layouts/footer/footer';
import {Header} from '../../../core/layouts/header/header';
import {Sidebar} from '../../../core/layouts/sidebar/sidebar';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Footer, Header, Sidebar, Header, Sidebar, Footer],
  template: `

    <app-header (burgerClick)="toggleSidebar()"></app-header>

    <div class="sidebar-overlay" [class.open]="sidebarOpen" (click)="closeSidebar()"></div>

    <div class="shell">
      <app-sidebar [class.open]="sidebarOpen" (closeMenu)="closeSidebar()"></app-sidebar>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>

    <app-footer></app-footer>

  `,
})
export class LayoutComponent {
  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
