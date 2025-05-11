import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Supplier } from 'src/app/models/supplier.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-supplier-prediction-details',
  templateUrl: './supplier-prediction-details.component.html',
  styleUrls: ['./supplier-prediction-details.component.css']
})
export class SupplierPredictionDetailsComponent implements OnInit {
  supplier: Supplier | undefined;
  isLoading: boolean = true;
  error: string | null = null;
  chartData: any = {
    labels: ['aiRating', 'sentiment', 'clickCount', 'createdAI'],
    datasets: [{
      data: [35, 25, 20, 20] // Example data - replace with your actual data
    }]
  };

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSupplierDetails();
  }

  loadSupplierDetails(): void {
    const supplierId = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.error = null;
    
    if (supplierId) {
      this.supplierService.getPredictionDetails(supplierId).subscribe({
        next: (data) => {
          this.supplier = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading supplier details:', error);
          this.error = 'Failed to load supplier details. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'Invalid supplier ID';
      this.isLoading = false;
    }
  }

  retryLoading(): void {
    this.loadSupplierDetails();
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-badge unknown';
    return status.toLowerCase() === 'active' ? 'status-badge active' : 'status-badge inactive';
  }

  getSentimentClass(sentiment: string | undefined): string {
    if (!sentiment) return 'sentiment-badge neutral';
    const sentimentUpper = sentiment.toUpperCase();
    if (sentimentUpper === 'POSITIVE') return 'sentiment-badge positive';
    if (sentimentUpper === 'NEGATIVE') return 'sentiment-badge negative';
    return 'sentiment-badge neutral';
  }

  getSentimentIcon(sentiment: string | undefined): string {
    if (!sentiment) return 'sentiment_neutral';
    const sentimentUpper = sentiment.toUpperCase();
    if (sentimentUpper === 'POSITIVE') return 'mood';
    if (sentimentUpper === 'NEGATIVE') return 'mood_bad';
    return 'sentiment_neutral';
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getFeatureValue(index: number): string {
    const value = this.chartData.datasets[0].data[index];
    return typeof value === 'number' ? value.toFixed(0) : '0';
  }

  getFeatureDescription(feature: string): string {
    const descriptions: {[key: string]: string} = {
      aiRating: 'Algorithmic assessment of supplier reliability',
      sentiment: 'Analysis of communication tone and sentiment',
      clickCount: 'User engagement with supplier profile',
      createdAI: 'AI-generated prediction confidence score'
    };
    return descriptions[feature] || 'Factor influencing prediction';
  }

  formatFeatureName(feature: string): string {
    // Convert camelCase to Title Case
    return feature.replace(/([A-Z])/g, ' $1')
                 .replace(/^./, str => str.toUpperCase())
                 .trim();
  }

  goToPrediction(): void {
    this.router.navigate(['/supp_prediction']);  // Navigate to the Prediction page
  }
  sendWarningEmail(id: number): void {
    this.supplierService.sendWarningEmail(id).subscribe({
      next: (response: any) => {
        console.log('Email sent successfully:', response.message);
        alert(response.message);  // Alert success message
      },
      error: (error) => {
        console.error('Error sending email:', error);
        alert('Failed to send email');
      }
    });
  }

  isSupplierInactive(): boolean {
    return this.supplier?.predictionStatus === 'inactive';
  }
  
  
}