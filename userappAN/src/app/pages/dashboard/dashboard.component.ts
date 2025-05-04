import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
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
export class DashboardComponent implements OnInit {
  showSummary = true; // Initially show the summary
  showCategoryChart = false; // Add a flag to control visibility of the category chart

  chartData: ChartData<'pie'> = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384']
      }
    ]
  };

  categoryChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70'],
        hoverBackgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70']
      }
    ]
  };

  summary = {
    totalSuppliers: 0,
    activeSuppliers: 0,
    inactiveSuppliers: 0,
    newSuppliersThisMonth: 0
  };
  clickCountChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      }
    ]
  };

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.loadSupplierStatusBreakdown();
    this.loadSuppliersByClickCount();
    this.loadSupplierCategoryBreakdown(); 
  }

  loadSupplierStatusBreakdown(): void {
    this.supplierService.getSupplierStatusBreakdown().subscribe((data) => {
      this.chartData = {
        labels: ['Active', 'Inactive'],
        datasets: [
          {
            data: [data.activeCount, data.inactiveCount],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
          }
        ]
      };
    });

    this.supplierService.getSummary().subscribe((summaryData) => {
      this.summary = summaryData;
    });
  }

  loadSuppliersByClickCount(): void {
    this.supplierService.getSuppliers().subscribe((data) => {
      const supplierNames = data.map((supplier) => supplier.name);
      const clickCounts = data.map((supplier) => supplier.clickCount || 0);

      this.clickCountChartData = {
        labels: supplierNames,
        datasets: [
          {
            data: clickCounts,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1
          }
        ]
      };
    });
  }

  // Navigate to the filtered suppliers list based on the selected category
  filterByActive(): void {
    this.router.navigate(['/suppliers'], { queryParams: { status: 'ACTIVE' } });
  }

  filterByInactive(): void {
    this.router.navigate(['/suppliers'], { queryParams: { status: 'INACTIVE' } });
  }

  filterByNew(): void {
    this.router.navigate(['/suppliers'], { queryParams: { newThisMonth: 'true' } });
  }

  loadSupplierCategoryBreakdown(): void {
  this.supplierService.getSupplierCategoryBreakdown().subscribe((data) => {
    // Ensure that categories and counts are typed correctly
    const categories: string[] = Object.keys(data);
    const counts: number[] = Object.values(data).map(value => Number(value)); // Ensure it's an array of numbers

    this.categoryChartData = {
      labels: categories,
      datasets: [
        {
          data: counts,  // Explicitly use number[] for data
          backgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70'],
          hoverBackgroundColor: ['#FFCC00', '#4CAF50', '#FF6384', '#36A2EB', '#FFCD70']
        }
      ]
    };

    this.showCategoryChart = true; // Show the category chart after loading data
  });
}


  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  goToMap(): void {
    this.router.navigate(['/supplier-map']);
  }

  goToPrediction(): void {
    this.router.navigate(['/prediction']);  // Navigate to the Prediction page
  }
}
