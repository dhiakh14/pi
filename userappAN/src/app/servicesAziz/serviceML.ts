import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceML {
 private baseUrl = 'http://localhost:8089/rouge/Rest';
  constructor(private http: HttpClient) { }

  predictDateEcheance(montant: number, dateEmission: string): Observable<string> {
    const params = new HttpParams()
      .set('montant', montant)
      .set('dateEmission', dateEmission);

    return this.http.get(`${this.baseUrl}/predictaziz`, { params, responseType: 'text' });
  }

}