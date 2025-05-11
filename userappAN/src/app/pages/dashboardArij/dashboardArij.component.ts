import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboardArij.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class DashboardArijComponent implements OnInit {
  showSummary = true;
  showCategoryChart = false;
  currentChartIndex = 0;
  chartCount = 3; // Number of charts (click count, status, categories)

  // Chart data
  chartData: ChartData<'pie'> = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#36A2EB', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384']
    }]
  };

  categoryChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70'],
      hoverBackgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70']
    }]
  };

  clickCountChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      borderWidth: 1
    }]
  };

  // Summary data
  summary = {
    totalSuppliers: 0,
    activeSuppliers: 0,
    inactiveSuppliers: 0,
    newSuppliersThisMonth: 0
  };

  constructor(
    private supplierService: SupplierService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadSupplierStatusBreakdown();
    this.loadSuppliersByClickCount();
    this.loadSupplierCategoryBreakdown();
  }

  loadSupplierStatusBreakdown(): void {
    this.supplierService.getSupplierStatusBreakdown().subscribe({
      next: (data) => {
        this.chartData = {
          labels: ['Active', 'Inactive'],
          datasets: [{
            data: [data.activeCount, data.inactiveCount],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
          }]
        };
      },
      error: (error) => {
        console.error('Error loading status breakdown:', error);
      }
    });

    this.supplierService.getSummary().subscribe({
      next: (summaryData) => {
        this.summary = summaryData;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
      }
    });
  }

  loadSuppliersByClickCount(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        const supplierNames = data.map(supplier => supplier.name);
        const clickCounts = data.map(supplier => supplier.clickCount || 0);

        this.clickCountChartData = {
          labels: supplierNames,
          datasets: [{
            data: clickCounts,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1
          }]
        };
      },
      error: (error) => {
        console.error('Error loading click count data:', error);
      }
    });
  }

  loadSupplierCategoryBreakdown(): void {
    this.supplierService.getSupplierCategoryBreakdown().subscribe({
      next: (data) => {
        const categories = Object.keys(data);
        const counts = Object.values(data).map(value => Number(value));

        this.categoryChartData = {
          labels: categories,
          datasets: [{
            data: counts,
            backgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70'],
            hoverBackgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70']
          }]
        };
        this.showCategoryChart = categories.length > 0;
        this.chartCount = this.showCategoryChart ? 3 : 2;
      },
      error: (error) => {
        console.error('Error loading category breakdown:', error);
        this.showCategoryChart = false;
        this.chartCount = 2;
      }
    });
  }

  // Chart navigation methods
  nextChart(): void {
    this.currentChartIndex = (this.currentChartIndex + 1) % this.chartCount;
    // Skip category chart if not available
    if (this.currentChartIndex === 2 && !this.showCategoryChart) {
      this.currentChartIndex = 0;
    }
  }

  prevChart(): void {
    this.currentChartIndex = (this.currentChartIndex - 1 + this.chartCount) % this.chartCount;
    // Skip category chart if not available
    if (this.currentChartIndex === 2 && !this.showCategoryChart) {
      this.currentChartIndex = 1;
    }
  }

  goToChart(index: number): void {
    if (index >= 0 && index < this.chartCount) {
      // Skip category chart if not available
      if (index === 2 && !this.showCategoryChart) {
        return;
      }
      this.currentChartIndex = index;
    }
  }

  // Filter navigation methods
  filterByActive(): void {
    this.router.navigate(['/suppliers'], { queryParams: { status: 'ACTIVE' } });
  }

  filterByInactive(): void {
    this.router.navigate(['/suppliers'], { queryParams: { status: 'INACTIVE' } });
  }

  filterByNew(): void {
    this.router.navigate(['/suppliers'], { queryParams: { newThisMonth: 'true' } });
  }

  // Navigation methods
  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  goToMap(): void {
    this.router.navigate(['/supplier-map']);
  }

  goToPrediction(): void {
    this.router.navigate(['/supp_prediction']);
  }
}