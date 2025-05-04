import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { RestService } from 'src/app/servicesAziz/services';
  

@Component({
  selector: 'app-facture-stat',
  templateUrl: './facture-stat.component.html',
  styleUrls: ['./facture-stat.component.css']
})
export class FactureStatComponent implements OnInit {

  loading: boolean = false;
  error: string | null = null;
  statsData: { [key: string]: number } = {};
  objectKeys= Object.keys;
  
  // Chart.js configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'État de facture' } },
      y: { 
        title: { display: true, text: 'Nombre de factures' },
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.parsed.y} factures` } }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };

  constructor(private restService: RestService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;
    
    this.restService.getStatistiquesParEtat().subscribe({
      next: (data) => {
        this.statsData = data;
        this.updateChartData();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques';
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateChartData(): void {
    const labels = Object.keys(this.statsData);
    const values = Object.values(this.statsData);
    const backgroundColors = this.generateColors(labels);
    
    this.barChartData = {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors.map((c, i) => this.darkenColor(c, labels[i])),
        borderColor: '#ffffff',
        borderWidth: 1
      }]
    };
  }

  private generateColors(labels: string[]): string[] {
    return labels.map(label => {
      switch(label.toUpperCase()) {
        case 'RETARD':
          return 'hsl(0, 70%, 60%)'; // Rouge
        case 'ATTENTE':
          return 'hsl(60, 70%, 60%)'; // Jaune
        case 'PAYE':
          return 'hsl(120, 70%, 60%)'; // Vert
        default:
          return 'hsl(200, 70%, 60%)'; // Couleur par défaut (bleu)
      }
    });
  }

  private darkenColor(color: string, label: string): string {
    const percent = label.toUpperCase() === 'PAYE' ? 15 : 20; // On assombrit moins le vert pour garder sa lisibilité
    return color.replace(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/, 
      (_, h, s, l) => `hsl(${h}, ${s}%, ${Math.max(0, parseFloat(l) - percent)}%)`);
  }

  getTotalFactures(): number {
    return Object.values(this.statsData).reduce((sum, count) => sum + count, 0);
  }

  navigateToFactureList() {
    this.router.navigate(['/facture']);
  }
}