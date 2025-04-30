import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { Task } from 'src/app/services1/models'; // Adjust the import path
import { TaskControllerService } from 'src/app/services1/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  pieChartType: ChartConfiguration<'pie'>['type'] = 'pie';

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartType: ChartConfiguration<'bar'>['type'] = 'bar';

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  constructor(private taskService: TaskControllerService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.updatePieChartData(tasks);
        this.updateBarChartData(tasks);
      },
      error: (err) => {
        console.error('Failed to fetch tasks:', err);
      }
    });
  }

  updatePieChartData(tasks: Task[]): void {
    const statusCounts: Record<string, number> = {
      'TO_DO': 0,
      'PENDING': 0,
      'IN_PROGRESS': 0,
      'COMPLETED': 0
    };

    tasks.forEach(task => {
      if (task.status && statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      }
    });

    this.pieChartData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
  }

  updateBarChartData(tasks: Task[]): void {
    const dateLabels: string[] = [];
    const startDateCounts: number[] = [];
    const plannedEndDateCounts: number[] = [];

    tasks.forEach(task => {
      if (task.startDate) {
        const startDate = new Date(task.startDate).toLocaleDateString();
        if (!dateLabels.includes(startDate)) {
          dateLabels.push(startDate);
        }
      }
      if (task.planned_end_date) {
        const plannedEndDate = new Date(task.planned_end_date).toLocaleDateString();
        if (!dateLabels.includes(plannedEndDate)) {
          dateLabels.push(plannedEndDate);
        }
      }
    });

    dateLabels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    dateLabels.forEach(date => {
      const startDateCount = tasks.filter(task => task.startDate && new Date(task.startDate).toLocaleDateString() === date).length;
      const plannedEndDateCount = tasks.filter(task => task.planned_end_date && new Date(task.planned_end_date).toLocaleDateString() === date).length;

      startDateCounts.push(startDateCount);
      plannedEndDateCounts.push(plannedEndDateCount);
    });

    this.barChartData = {
      labels: dateLabels,
      datasets: [
        {
          label: 'Start Date',
          data: startDateCounts,
          backgroundColor: '#36A2EB'
        },
        {
          label: 'Planned End Date',
          data: plannedEndDateCounts,
          backgroundColor: '#FFCE56'
        }
      ]
    };
  }
}