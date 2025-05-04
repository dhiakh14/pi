import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-supp-prediction',
  templateUrl: './supp-prediction.component.html',
  styleUrls: ['./supp-prediction.component.css']
})
export class SuppPredictionComponent implements OnInit {
  createdAt: string = ''; // Date in string format
  aiRating: number = 0;
  clickCount: number = 0;
  predictionStatus: string = '';
  isLoading: boolean = false;
  probabilities: number[] = [];  // Will hold the probabilities for active/inactive

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {}

  getPrediction(): void {
    this.isLoading = true;

    const supplierData = {
      createdAt: new Date(this.createdAt).getTime(),  // Convert to timestamp
      aiRating: this.aiRating,
      clickCount: this.clickCount
    };

    this.supplierService.getPredictionForSupplier(supplierData).subscribe({
      next: (response: any) => {
        this.predictionStatus = response.status;
        this.probabilities = response.probabilities[0];  // Storing the probabilities
        this.isLoading = false;
        console.log('Prediction Status:', this.predictionStatus);
        console.log('Probabilities:', this.probabilities);
      },
      error: (error: any) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
