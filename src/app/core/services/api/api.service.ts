import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ApiService {

  private readonly baseUrl = `${environment.serverUrl}/api`;

  private readonly httpClient = inject(HttpClient)

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.patch<T>(`${this.baseUrl}/${url}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}

