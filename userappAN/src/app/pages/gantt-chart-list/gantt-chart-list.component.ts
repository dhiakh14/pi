import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GanttChartControllerService } from 'src/app/services1/services';
import 'dhtmlx-gantt'; // Import the Gantt library
import { GanttChart } from 'src/app/services1/models';
declare const gantt: any; // Declare the Gantt library

@Component({
  selector: 'app-gantt-chart-list',
  templateUrl: './gantt-chart-list.component.html',
  styleUrls: ['./gantt-chart-list.component.css']
})
export class GanttChartListComponent implements OnInit, AfterViewInit {
  ganttCharts: GanttChart[] = []; // List of all Gantt charts
  selectedGanttChart: GanttChart | null = null; // Currently selected Gantt chart

  constructor(private ganttChartService: GanttChartControllerService) {}

  // Initialize the Gantt chart after the view is loaded
  ngAfterViewInit(): void {
    this.initializeGantt();
  }

  // Fetch all Gantt charts when the component initializes
  ngOnInit(): void {
    this.loadGanttCharts();
  }

  // Fetch all Gantt charts from the backend
  loadGanttCharts(): void {
    this.ganttChartService.getAllGanttCharts().subscribe({
      next: (response: GanttChart[]) => {
        this.ganttCharts = response;
        console.log('Gantt charts loaded successfully:', this.ganttCharts);
      },
      error: (error) => {
        console.error('Error fetching Gantt charts:', error);
        alert('Failed to load Gantt charts. Please try again.');
      }
    });
  }

  // Initialize the Gantt chart
  initializeGantt(): void {
    const ganttContainer = document.getElementById('gantt-container');
    if (ganttContainer) {
      gantt.init(ganttContainer);
    } else {
      console.warn('Gantt container not found in the DOM.');
    }
  }

  renderGanttChart(ganttChart: GanttChart): void {
    if (!ganttChart || !ganttChart.tasks || ganttChart.tasks.length === 0) {
      console.warn('No tasks found in the selected Gantt chart.');
      alert('No tasks available in this Gantt chart.');
      return;
    }

    // Clear the existing Gantt chart
    gantt.clearAll();

    // Parse and render the tasks
    gantt.parse({
      data: ganttChart.tasks.map(task => ({
        id: task.idTask,
        text: task.name,
        start_date: this.convertToGanttDateFormat(task.startDate || ''),
        duration: this.calculateDuration(task.startDate || '', task.planned_end_date || ''),
        progress: this.calculateProgress(task.status ?? 'PENDING'),
        dependencies: []
      }))
    });

    // Set the selected Gantt chart
    this.selectedGanttChart = ganttChart;
  }

  private convertToGanttDateFormat(date: string | number | Date): string {
    if (!date) return '';

    let parsedDate: Date;

    // Handle Date object
    if (date instanceof Date) {
      parsedDate = date;
    }
    // Handle ISO string
    else if (typeof date === 'string') {
      parsedDate = new Date(date);
    }
    // Handle timestamp (number)
    else if (typeof date === 'number') {
      parsedDate = new Date(date);
    }
    // Invalid date
    else {
      console.error('Invalid date format:', date);
      return '';
    }

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }

    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Calculate duration between two dates in days
  private calculateDuration(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Duration in days
  }

  // Calculate progress based on task status
  private calculateProgress(status: string): number {
    if (status === 'COMPLETED') return 1; // 100% progress
    if (status === 'IN_PROGRESS') return 0.5; // 50% progress
    return 0; // 0% progress
  }
}