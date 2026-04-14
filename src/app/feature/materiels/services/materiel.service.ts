import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class MaterielService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getMateriels() {
    return this.http.get<any[]>(`${this.baseApiUrl}/materiels/liste`);
  }
}
