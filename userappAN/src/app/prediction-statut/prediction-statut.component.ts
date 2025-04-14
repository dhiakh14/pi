import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prediction-statut',
  templateUrl: './prediction-statut.component.html'
})
export class PredictionStatutComponent {
  inputData: any = {};
  predictionResult: string = '';

  constructor(private http: HttpClient) {}

  predictStatus() {
    this.http.post<any>('http://localhost:5000/predict', this.inputData).subscribe(
      res => this.predictionResult = res.status,
      err => console.error(err)
    );
  }
}