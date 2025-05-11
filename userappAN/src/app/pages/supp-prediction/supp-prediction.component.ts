import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Import Router
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Supplier } from 'src/app/models/supplier.model';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-supp-prediction',
  templateUrl: './supp-prediction.component.html',
  styleUrls: ['./supp-prediction.component.css']
})
export class SuppPredictionComponent implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  filterStatus: string = '';

  constructor(
    private supplierService: SupplierService,
    private router: Router  // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliersPrediction().subscribe({
      next: (data) => {
        console.log('Fetched Supplier Data:', data);  // Log the entire response data
        this.suppliers = data;
        this.filteredSuppliers = [...this.suppliers];
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  

  filterByStatus(event: MatSelectChange): void {
    this.filterStatus = event.value;
    
    if (!this.filterStatus) {
      this.filteredSuppliers = [...this.suppliers];
    } else {
      this.filteredSuppliers = this.suppliers.filter(
        supplier => supplier.predictionStatus?.toLowerCase() === this.filterStatus.toLowerCase()
      );
    }
  }

  // Add goToPredictionDetails method
  goToPredictionDetails(supplier: Supplier): void {
    console.log('Navigating to details for supplier ID:', supplier.idSupplier);  // Correct field
    if (supplier.idSupplier) {
      this.router.navigate(['/prediction-details', supplier.idSupplier]);
    } else {
      console.error('Invalid supplier ID:', supplier.idSupplier);
    }
  }
  
  

  
  
  
  

  // Existing methods for handling sentiment, rating, etc.
  getSentimentClass(sentiment: string | undefined): string {
    if (!sentiment) return 'neutral';
    const sentimentUpper = sentiment.toUpperCase();
    if (sentimentUpper === 'POSITIVE') return 'positive';
    if (sentimentUpper === 'NEGATIVE') return 'negative';
    return 'neutral';
  }

  getAiRatingClass(rating: number | undefined): string {
    if (rating === undefined || rating === null) return 'low-rating';
    if (rating >= 4) return 'high-rating';
    if (rating >= 3) return 'medium-rating';
    return 'low-rating';
  }

  getPredictionStatusClass(status: string | undefined): string {
    if (!status) return 'inactive-status';
    return status.toLowerCase() === 'active' ? 'active-status' : 'inactive-status';
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
