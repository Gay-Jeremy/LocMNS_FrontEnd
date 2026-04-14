import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class UtilisateurService {

  private baseApiUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(private http: HttpClient) {}

  getUtilisateur() {
    return this.http.get<any[]>(`${this.baseApiUrl}/liste`);
  }
}
