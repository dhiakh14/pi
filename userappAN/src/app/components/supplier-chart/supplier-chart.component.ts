import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { SupplierService } from 'src/app/service-arij/supplier.service';


@Component({
  selector: 'app-supplier-chart',
  templateUrl: './supplier-chart.component.html',
  styleUrls: ['./supplier-chart.component.css']
})
export class SupplierChartComponent implements OnInit {
  chartData: ChartData<'bar'> = { labels: [], datasets: [] }; // ✅ Ensure correct type
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
    }
  };

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      console.log("Supplier Data:", data);

      const clickCounts = data.map(supplier => supplier.clickCount || 0);
      const supplierNames = data.map(supplier => supplier.name);

      this.chartData = {
        labels: supplierNames,
        datasets: [
          {
            label: 'Supplier Views',
            data: clickCounts,
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'],
          },
        ],
      };
    }, error => {
      console.error("Error loading chart data:", error);
    });
  }
}
