import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Task } from 'src/app/services1/models';
import { TaskControllerService } from 'src/app/services1/services';
import 'dhtmlx-gantt'; 

declare const gantt: any; 

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  selectedTaskIds: Set<number> = new Set();

  constructor(private taskService: TaskControllerService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    gantt.init('gantt-container');
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (response) => {
        if (response instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const jsonResponse = JSON.parse(reader.result as string);
              if (Array.isArray(jsonResponse)) {
                this.tasks = jsonResponse;
              } else {
                console.error('Expected an array of tasks, but received:', jsonResponse);
              }
            } catch (error) {
              console.error('Error parsing JSON from Blob:', error);
            }
          };
          reader.readAsText(response);
        } else if (Array.isArray(response)) {
          this.tasks = response;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  toggleSelection(taskId: number): void {
    if (this.selectedTaskIds.has(taskId)) {
      this.selectedTaskIds.delete(taskId);
    } else {
      this.selectedTaskIds.add(taskId);
    }
  }

  generateGanttChart(): void {
    const selectedTasks = this.tasks.filter(task => this.selectedTaskIds.has(task.idTask!));

    if (selectedTasks.length === 0) {
      console.warn('No tasks selected for Gantt chart.');
      return;
    }

    const ganttData = selectedTasks.map(task => ({
      id: task.idTask,
      text: task.name,
      start_date: this.convertToGanttDateFormat(task.startDate || ''),
      duration: this.calculateDuration(task.startDate || '', task.planned_end_date || ''),
      progress: this.calculateProgress(task.status ?? 'PENDING'),
      dependencies: [],
    }));

    gantt.clearAll(); // Clear existing data
    gantt.parse({ data: ganttData });
  }

  private convertToGanttDateFormat(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        console.error('Invalid date:', date);
        return '';
    }

    parsedDate.setHours(0, 0, 0, 0);

    // Format the date correctly for Gantt: "dd-MM-yyyy"
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${day}-${month}-${year}`;
}

  private calculateDuration(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getTime() - start.getTime()) / (1000 * 3600 * 24); 
  }

  private calculateProgress(status: string): number {
    if (status === 'COMPLETED') return 1; 
    if (status === 'IN_PROGRESS') return 0.5; 
    return 0; 
  }
}
