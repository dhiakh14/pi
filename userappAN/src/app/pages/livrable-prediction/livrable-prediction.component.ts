import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { LivrableService } from 'src/app/servicesEmira/livrable.service';

@Component({
  selector: 'app-livrable-prediction',
  templateUrl: './livrable-prediction.component.html',
  styleUrls: ['./livrable-prediction.component.css']
})
export class LivrablePredictionComponent {
  description: string = '';
  createdAt: string = '';
  dueDate: string = '';
  predictedStatus: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private livrableService: LivrableService) {}

  onSubmit() {
    this.loading = true;
  this.errorMessage = '';

  // Prepare the data to send to the backend for prediction
  const livrableData = {
    description: this.description,
    createdAt: this.createdAt,
    due_date: this.dueDate
  };
  this.livrableService.predictLivrableStatus(livrableData).subscribe(
    (response) => {
      this.loading = false;
      console.log('Backend Response:', response);  // Log the response to check its structure
      
      // Check if the response contains a 'predicted_status' property and use it
      if (response && response.predicted_status) {
        this.predictedStatus = response.predicted_status;  // Use the predicted_status from the response
      } else {
        this.predictedStatus = 'No status predicted';
      }
    },
    (error) => {
      this.loading = false;
      this.errorMessage = 'An error occurred while predicting the status.';
      console.error('Prediction Error:', error);
    }
  );
}
}
