import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Livrable } from '../common/livrable';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivrableService {
  
  
  private baseUrl = 'http://localhost:8085/livrable/api/Livrables';

  constructor(private httpClient: HttpClient) { }

  getLivrableList(): Observable<Livrable[]> {
    return this.httpClient.get<Livrable[]>(this.baseUrl);
  }

  addLivrable(livrable: Livrable): Observable<Livrable> {
    return this.httpClient.post<Livrable>("http://localhost:8085/livrable/api/Livrables/add", livrable);
  }

  getLivrableById(id: number): Observable<Livrable> {
    return this.httpClient.get<Livrable>(`http://localhost:8085/livrable/api/Livrables/getById/${id}`);
  }
  updateLivrable(id: number, livrable: Livrable): Observable<Livrable> {
    return this.httpClient.put<Livrable>(`http://localhost:8085/livrable/api/Livrables/update/${id}`, livrable);
  }

  deleteLivrable(id: number) {
    return this.httpClient.delete(`http://localhost:8085/livrable/api/Livrables/delete/${id}`); 
  }
  getLivrablesGroupedByProject(): Observable<{ [projectName: string]: Livrable[] }> {
    return this.httpClient.get<{ [projectName: string]: Livrable[] }>(
      'http://localhost:8085/livrable/api/Livrables/groupedByProject');
  }
  
  downloadLivrablePdf(id: number) {
    return this.httpClient.get(`http://localhost:8085/livrable/api/Livrables/${id}/pdf`, {
      responseType: 'blob'
    });}

    getProjectStats(): Observable<any> {
      return this.httpClient.get(`${this.baseUrl}/project-stats`);
    }
   // Method to fetch filtered livrables
  getLivrablesFiltered(params: HttpParams): Observable<Livrable[]> {
    // Adjusting URL path to match the controller's filter mapping
    return this.httpClient.get<Livrable[]>(
      'http://localhost:8085/livrable/api/Livrables/filter', 
      { params }
    );
  }
  // Method to predict livrable status
  predictLivrableStatus(data: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8085/livrable/api/Livrables/predict', data);
  }
    
  
} 
