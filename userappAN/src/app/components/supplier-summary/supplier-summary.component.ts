import { Component, OnInit } from '@angular/core';
import { SupplierService, SupplierSummary } from 'src/app/service-arij/supplier.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-supplier-summary',
  templateUrl: './supplier-summary.component.html',
  styleUrls: ['./supplier-summary.component.css']
})
export class SupplierSummaryComponent implements OnInit {
  summary: SupplierSummary | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private supplierService: SupplierService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.isLoading = true;
    this.error = null;
    
    this.supplierService.getSummary().pipe(
      catchError(err => {
        this.error = 'Failed to load supplier data';
        this.snackBar.open(this.error, 'Dismiss', { duration: 5000 });
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe((data: SupplierSummary | null) => {
      this.summary = data;
    });
  }

  refresh() {
    this.loadSummary();
  }
}