import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatsDTO } from '../models/stats.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:8085/livrable/api/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsDTO> {
    return this.http.get<StatsDTO>(this.apiUrl);
  }
}
