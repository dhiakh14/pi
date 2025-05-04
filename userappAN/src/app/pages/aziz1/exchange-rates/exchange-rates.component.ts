import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { RestService } from 'src/app/servicesAziz/services';
import { StrictHttpResponse } from 'src/app/servicesAziz/strict-http-response';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css']
})
export class ExchangeRatesComponent {
  ratesResponse: {
    base?: string,
    rates?: { [key: string]: number },
    date?: string,
    error?: any
  } | null = null;
  
  isLoading = false;
  error: string | null = null;

  constructor(private restService: RestService,
    private router : Router
  ) {}

  loadRates() {
    this.isLoading = true;
    this.error = null;
    this.ratesResponse = null;

    // Using the generated service method
    this.restService.getRates().pipe(
      catchError(err => {
        this.error = err.message || 'Failed to load rates';
        return of(null);
      })
    ).subscribe(response => {
      this.isLoading = false;
      this.ratesResponse = response;
    });
  }

  // Helper to get currency pairs
  getCurrencyPairs(): { currency: string, rate: number }[] {
    if (!this.ratesResponse?.rates) return [];
    return Object.entries(this.ratesResponse.rates).map(([currency, rate]) => ({
      currency,
      rate
    }));
  }
  navigateToFactureList() {
    this.router.navigate(['/facture']);
  }
  
}