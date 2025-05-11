import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private flaskApiUrl = 'http://localhost:5000/predict-price';  // Make sure this is the correct Flask endpoint

  constructor(private http: HttpClient) { }

  // Define the method to get prediction
  getPrediction(firstName: string, quantity: number, category: string): Observable<any> {
    const body = { first_name: firstName, quantity: quantity, category: category };
    return this.http.post<any>(this.flaskApiUrl, body);  // Adjust the response type if needed
  }
}
