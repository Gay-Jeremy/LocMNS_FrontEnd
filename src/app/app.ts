import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './core/layouts/header/header';
import {Sidebar} from './core/layouts/sidebar/sidebar/sidebar';
import {Footer} from './core/layouts/footer/footer/footer';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('locmns-frontend');
}
