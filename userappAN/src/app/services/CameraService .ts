import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PredictionRequest } from './models/PredictionRequest';




interface PredictionResponse {
  predicted_duration_days?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private predictUrl = 'http://localhost:8086/planning/Task/predictDuration';
  private baseUrl = 'http://localhost:8086/planning/camera';

  



  constructor(private http: HttpClient) { }

  startCamera(): Observable<any> {
    return this.http.post(`${this.baseUrl}/start`, {});
  }

  stopCamera(): Observable<any> {
    return this.http.post(`${this.baseUrl}/stop`, {});
  }

  getCameraStatus(): Observable<{ running: boolean, ready: boolean }> {
    return this.http.get<{ running: boolean, ready: boolean }>(`${this.baseUrl}/status`);
  }

  getDetection(): Observable<{
    image?: string,
    detections?: Array<{
      class: string,
      confidence: number,
      bbox: number[]
    }>,
    error?: string
  }> {
    return this.http.get(`${this.baseUrl}`);
  }

  startDetectionPolling(intervalMs: number = 100): Observable<any> {
    return new Observable(observer => {
      const intervalId = setInterval(() => {
        this.getDetection().subscribe({
          next: (data) => observer.next(data),
          error: (err) => observer.error(err)
        });
      }, intervalMs);

      return () => clearInterval(intervalId);
    });
  }

  predictTaskDuration(
    name: string,
    description: string,
    effectif: number,
    niveauComplexity: 'low' | 'medium' | 'hard'
  ): Observable<PredictionResponse> {
    const requestBody: PredictionRequest = {
      name: name.trim(),
      description: description.trim(),
      effectif: effectif,
      niveau_complexity: niveauComplexity.toLowerCase() as 'low' | 'medium' | 'hard'
    };

    return this.http.post<PredictionResponse>(this.predictUrl, requestBody);
  }
}
