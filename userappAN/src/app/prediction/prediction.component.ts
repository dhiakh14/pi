import { Component } from '@angular/core';
import { PredictionService } from '../services/prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {

  firstName: string = '';
  quantity: number = 0;
  category: string = '';
  predictedPrice: number | null = null;
  errorMessage: string | null = null;

  constructor(private predictionService: PredictionService) { }

  // Method to fetch the prediction from the backend when the button is clicked
  getPrediction(): void {
    // Validate inputs
    if (!this.firstName || !this.category || this.quantity <= 0) {
      this.errorMessage = 'Please enter valid values for first name, quantity, and category.';
      this.predictedPrice = null;
      return;
    }

    // Call the PredictionService to get the prediction from Flask API
    this.predictionService.getPrediction(this.firstName, this.quantity, this.category)
      .subscribe(
        (response: any) => {  // Adjust according to the actual response structure
          this.predictedPrice = response.predicted_price;
          this.errorMessage = null; // Clear any previous error message
        },
        (error) => {
          // Handle error from the service call
          this.errorMessage = 'Failed to fetch prediction. ' + (error.error?.errorMessage || error.message);
          this.predictedPrice = null;
        }
      );
  }
}
