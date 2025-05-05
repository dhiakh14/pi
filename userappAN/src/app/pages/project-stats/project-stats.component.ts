import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProjectControllerService } from 'src/app/servicesAbir/services';

@Component({
  selector: 'app-project-stats',
  templateUrl: './project-stats.component.html',
  styleUrls: ['./project-stats.component.css']
})
export class ProjectStatsComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: Chart | null = null;
  isLoading = true;
  error: string | null = null;
  statsData: { [key: string]: number } | null = null;
  averageDuration: number | null = null; // Nouvelle variable pour la durée moyenne

  constructor(private projectService: ProjectControllerService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadAverageDuration(); // Charge la durée moyenne des projets
  }

  ngAfterViewInit(): void {
    if (this.statsData) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;

    this.projectService.getStatisticsByStatus().subscribe({
      next: (stats) => {
        this.statsData = stats;
        this.initChart();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.error = 'Erreur de chargement des données';
        this.isLoading = false;
      }
    });
  }

  loadAverageDuration(): void {
    this.projectService.getAverageDuration().subscribe({
      next: (duration) => {
        this.averageDuration = duration;
      },
      error: (err) => {
        console.error('Error loading average duration:', err);
      }
    });
  }

  private initChart(): void {
    this.destroyChart();

    if (!this.statsData) return;

    const ctx = document.getElementById('projectStatsChart') as HTMLCanvasElement;
    if (!ctx) return;

    const statusLabels = {
      'ON_GOING': 'ON GOING',
      'COMPLETED': 'COMPLETED',
      'DELAYED': 'DELAYED'
    };

    const labels = Object.keys(this.statsData).map(key => statusLabels[key as keyof typeof statusLabels] || key);
    const data = Object.values(this.statsData);

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#f4a261', // ON_GOING
            '#2a9d8f', // COMPLETED
            '#264653'  // DELAYED
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  getFormattedDuration(durationInDays: number | null): string {
    if (!durationInDays) return 'Chargement...';
  
    const years = Math.floor(durationInDays / 365);
    const months = Math.floor((durationInDays % 365) / 30);
    const quarters = Math.floor(durationInDays / 90); // Un trimestre = 90 jours
    const semesters = Math.floor(durationInDays / 180); // Un semestre = 180 jours
  
    let formattedDuration = '';
  
    if (years > 0) {
      formattedDuration += `${years} ${years > 1 ? 'years' : 'year'}`;
      if (months > 0) formattedDuration += ` and ${months} month`;
    } else if (quarters > 0) {
      formattedDuration += `${quarters} quarter${quarters > 1 ? 's' : ''}`;
    } else if (semesters > 0) {
      formattedDuration += `${semesters} semester${semesters > 1 ? 's' : ''}`;
    } else {
      formattedDuration = `${durationInDays} days`;
    }
  
    return formattedDuration;
  }
  
}