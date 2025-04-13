import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType,  ChartDataset } from 'chart.js';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-supplier-chart',
  templateUrl: './supplier-chart.component.html',
  styleUrls: ['./supplier-chart.component.css']
})
export class SupplierChartComponent implements OnInit {
  chartData: any;
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  chartLabels: string[] = [];


constructor(private supplierService: SupplierService, private router: Router) {}


  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.chartLabels = data.map(supplier => supplier.name);
      const clickCounts = data.map(supplier => supplier.clickCount || 0);
      const backgroundColors = this.generateColors(clickCounts.length);
  
      this.chartData = {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Supplier Views',
            data: clickCounts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
          }
        ]
      };
    });
  }
  
  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
  }
  
}
