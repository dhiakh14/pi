import { Component, Input } from '@angular/core';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-rating',
  templateUrl: './supplier-rating.component.html',
  styleUrls: ['./supplier-rating.component.css']
})
export class SupplierRatingComponent {
  @Input() supplier!: Supplier;
  
  get rating(): number {
    // Convert sentiment to rating if aiRating not available
    if (this.supplier.aiRating) {
      return this.supplier.aiRating;
    }
    
    // Fallback to sentiment conversion
    switch(this.supplier.sentiment?.toLowerCase()) {
      case 'positive': return 5;
      case 'neutral': return 3;
      case 'negative': return 1;
      default: return 0; // No rating available
    }
  }
  
  get tooltipText(): string {
    if (this.supplier.sentiment) {
      return `Sentiment: ${this.supplier.sentiment}`;
    }
    return this.supplier.aiRating ? `AI Rating: ${this.supplier.aiRating}` : 'No rating available';
  }
}