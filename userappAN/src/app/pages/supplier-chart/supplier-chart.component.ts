import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
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

      this.chartData = {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Supplier Views',
            data: clickCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
    });
  }
  goBack(): void {
    this.router.navigate(['/suppliers']);
  }
}
