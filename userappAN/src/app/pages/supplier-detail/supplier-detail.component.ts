import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from 'src/app/service-arij/supplier.service';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.css']
})
export class SupplierDetailComponent implements OnInit {
  supplier: Supplier | null = null;
  supplierId!: number;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSupplier();
  }

  private loadSupplier(): void {
    this.supplierId = +this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true;
    this.errorMessage = null;

    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (data) => {
        this.supplier = data;
        this.isLoading = false;
        console.log('Supplier loaded:', data);
      },
      error: (err) => {
        console.error('Error loading supplier:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load supplier details. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  editSupplier(): void {
    this.router.navigate(['/supplier/update', this.supplierId]);
  }

  deleteSupplier(): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(this.supplierId).subscribe({
        next: () => {
          alert('Supplier deleted successfully!');
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          console.error('Error deleting supplier:', err);
          alert('Failed to delete supplier. Please try again.');
        }
      });
    }
  }

  analyzeSentiment(): void {
    if (!this.supplier?.notes) {
      alert('Please add notes first');
      return;
    }

    this.supplierService.analyzeSentiment(this.supplier.notes).subscribe({
      next: (response) => {
        if (this.supplier) {
          this.supplier.sentiment = response.sentiment;
          
          // Update rating based on sentiment
          this.supplier.aiRating = this.calculateRating(response.sentiment);
          
          // Persist changes
          this.updateSupplier();
        }
      },
      error: (err) => {
        console.error('Sentiment analysis failed', err);
        alert('Failed to analyze sentiment. Please try again.');
      }
    });
  }

  private calculateRating(sentiment: string): number {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE': return 5;
      case 'NEUTRAL': return 3;
      case 'NEGATIVE': return 1;
      default: return 0;
    }
  }

  private updateSupplier(): void {
    if (!this.supplier) return;

    this.supplierService.updateSupplier(this.supplierId, this.supplier).subscribe({
      next: () => {
        console.log('Supplier updated with new sentiment and rating');
        this.loadSupplier(); // Refresh data
      },
      error: (err) => {
        console.error('Error updating supplier:', err);
        alert('Failed to save analysis results.');
      }
    });
  }
}