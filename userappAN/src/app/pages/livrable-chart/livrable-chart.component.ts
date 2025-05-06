import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartType } from 'ng-apexcharts';

@Component({
  selector: 'app-livrable-chart',
  templateUrl: './livrable-chart.component.html',
  styleUrls: ['./livrable-chart.component.css']
})
export class LivrableChartComponent implements OnInit {
   // Chart Type
  public barChartType: ChartType = 'bar';

  // Chart Data
  public barChartData: ChartData<'bar'> = {
    labels: [],  // To be populated with project names
    datasets: [
      {
        data: [],  // To be populated with the number of livrables
        label: 'Number of Livrables',
        backgroundColor: [],  // Dynamically populated with random colors
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        hoverBorderWidth: 2
      }
    ]
  };

  // Chart Options
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Projects'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Livrables'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  constructor(private http: HttpClient) { }

  // Function to generate random colors for each bar
  private generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;  // Semi-transparent colors
  }

  ngOnInit(): void {
    // Fetch grouped livrables from the backend using the correct endpoint
    this.http.get<Map<string, any>>('http://localhost:8085/livrable/api/Livrables/groupedByProject')
      .subscribe({
        next: (groupedLivrables) => {
          const labels: string[] = [];
          const data: number[] = [];
          const backgroundColors: string[] = [];

          // Loop through each project and prepare data for the chart
          for (const [projectName, livrables] of Object.entries(groupedLivrables)) {
            labels.push(projectName);
            data.push(livrables.length);  // Count the livrables for each project
            backgroundColors.push(this.generateRandomColor());  // Random color for each project
          }

          // Update chart data
          this.barChartData.labels = labels;
          this.barChartData.datasets[0].data = data;
          this.barChartData.datasets[0].backgroundColor = backgroundColors;
        },
        error: (error) => {
          console.error('Error fetching grouped livrables:', error);
        }
      });
  }
}
