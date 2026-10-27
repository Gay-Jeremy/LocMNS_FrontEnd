import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { jwtInterceptor } from './jwt-interceptor';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('ajoute le jeton dans l\'en-tête Authorization quand l\'utilisateur est connecté', () => {
    localStorage.setItem('jwt', 'jeton-de-test');

    http.get('/api/materiels/liste').subscribe();

    const requete = httpMock.expectOne('/api/materiels/liste');
    expect(requete.request.headers.get('Authorization')).toBe('Bearer jeton-de-test');
    requete.flush([]);
  });

  it('n\'ajoute aucun en-tête sans jeton', () => {
    http.get('/api/materiels/liste').subscribe();

    const requete = httpMock.expectOne('/api/materiels/liste');
    expect(requete.request.headers.has('Authorization')).toBe(false);
    requete.flush([]);
  });
});
