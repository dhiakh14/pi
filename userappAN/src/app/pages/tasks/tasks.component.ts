import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/services1/models';
import { TaskControllerService } from 'src/app/services1/services';
import { GanttChartControllerService, SaveGanttChart$Params } from 'src/app/services1/services/gantt-chart-controller.service';
import 'dhtmlx-gantt'; // Import the Gantt library
declare const gantt: any; // Declare the Gantt library

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit {
  tasks: Task[] = []; // List of all tasks
  filteredTasks: Task[] = []; // List of filtered tasks based on search
  selectedTaskIds: Set<number> = new Set(); // Set of selected task IDs
  searchQuery: string = ''; // Search query for filtering tasks
  ganttData: any; // Variable to store Gantt chart data

  constructor(
    private taskService: TaskControllerService,
    private ganttChartService: GanttChartControllerService, // Inject Gantt chart service
    private router: Router
  ) {}

  // Initialize the Gantt chart after the view is loaded
  ngAfterViewInit(): void {
    gantt.init('gantt-container');
  }

  // Load tasks when the component initializes
  ngOnInit(): void {
    this.loadTasks();
  }

  // Fetch all tasks from the backend
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
                this.filteredTasks = [...this.tasks];
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
          this.filteredTasks = [...this.tasks];
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  // Toggle selection of a task
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
      alert('Please select at least one task to generate the Gantt chart.');
      return;
    }
  
    // Prepare the Gantt chart data
    this.ganttData = {
      taskName: 'Generated Gantt Chart', // Example name
      startDate: this.convertToBackendDateFormat(selectedTasks[0].startDate || ''), // Use the first task's start date
      endDate: this.convertToBackendDateFormat(selectedTasks[selectedTasks.length - 1].planned_end_date || ''), // Use the last task's end date
      progress: this.calculateAverageProgress(selectedTasks), // Calculate average progress
      tasks: selectedTasks.map(task => ({
        idTask: task.idTask,
        name: task.name,
        description: task.description || '', // Ensure description is not null
        startDate: this.convertToBackendDateFormat(task.startDate || ''),
        planned_end_date: this.convertToBackendDateFormat(task.planned_end_date || ''),
        actual_end_date: this.convertToBackendDateFormat(task.actual_end_date || ''), // Ensure actual_end_date is not null
        status: task.status || 'PENDING' // Default to 'PENDING' if status is null
      }))
    };
  
    console.log('Generated Gantt Data:', JSON.stringify(this.ganttData, null, 2));
  
    gantt.clearAll();
    gantt.parse({ data: selectedTasks.map(task => ({
      id: task.idTask,
      text: task.name,
      start_date: this.convertToGanttDateFormat(task.startDate || ''),
      duration: this.calculateDuration(task.startDate || '', task.planned_end_date || ''),
      progress: this.calculateProgress(task.status ?? 'PENDING'),
      dependencies: [],
    })) });
  }
  
  private convertToBackendDateFormat(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
  
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
  
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  // Calculate average progress for selected tasks
  private calculateAverageProgress(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + this.calculateProgress(task.status ?? 'PENDING'), 0);
    return totalProgress / tasks.length;
  }

 
  saveGanttChart(ganttData: any): void {
    if (!ganttData) {
      alert('No Gantt chart data to save. Please generate the Gantt chart first.');
      return;
    }
  
    // Prepare the Gantt chart data in the Swagger-compatible format
    const swaggerCompatibleGanttData = {
      id: 0, // Set to 0 or omit if the backend generates the ID
      taskName: ganttData.taskName,
      startDate: ganttData.startDate,
      endDate: ganttData.endDate,
      progress: ganttData.progress,
      tasks: ganttData.tasks.map((task: { idTask: any; name: any; description: any; startDate: any; planned_end_date: any; actual_end_date: any; status: any; }) => ({
        idTask: task.idTask,
        name: task.name,
        description: task.description || '', // Ensure description is not null
        startDate: task.startDate,
        planned_end_date: task.planned_end_date,
        actual_end_date: task.actual_end_date || null, // Ensure actual_end_date is not null
        status: task.status || 'PENDING' // Default to 'PENDING' if status is null
      }))
    };
  
    // Log the Gantt chart data being sent
    console.log('Gantt Data to be saved:', JSON.stringify(swaggerCompatibleGanttData, null, 2)); // Pretty-print the payload
  
    const saveParams: SaveGanttChart$Params = {
      body: swaggerCompatibleGanttData // Pass the Gantt chart data as the request body
    };
  
    // Log the saveParams object
    console.log('Save Params:', JSON.stringify(saveParams, null, 2));
  
    this.ganttChartService.saveGanttChart(saveParams).subscribe({
      next: (response) => {
        console.log('Gantt chart saved successfully:', JSON.stringify(response, null, 2)); // Pretty-print the response
        alert('Gantt chart saved successfully!');
      },
      error: (error) => {
        console.error('Error saving Gantt chart:', error);
        console.error('Full error response:', JSON.stringify(error, null, 2)); // Pretty-print the error
        alert('Failed to save Gantt chart. Check the console for details.');
      }
    });
  }

  // Convert date to Gantt chart format (DD-MM-YYYY)
  private convertToGanttDateFormat(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }

    parsedDate.setHours(0, 0, 0, 0);

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

  // Delete a task
  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      const originalTasks = [...this.tasks];
      this.tasks = this.tasks.filter(task => task.idTask !== taskId);
      this.filteredTasks = this.filteredTasks.filter(task => task.idTask !== taskId);

      this.taskService.deleteTask({ id: taskId }).subscribe(
        () => {
          console.log(`Task ${taskId} deleted successfully.`);
        },
        (error) => {
          console.error(`Error deleting task ${taskId}:`, error);
          // Rollback if the delete request fails
          this.tasks = originalTasks;
          this.filteredTasks = originalTasks;
          alert('Failed to delete the task. Please try again.');
        }
      );
    }
  }

  // Filter tasks based on search query
  filterTasks(): void {
    if (!this.searchQuery) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task =>
        (task.name?.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (task.description?.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
  }

  // Navigate to the edit task page
  editTask(task: Task): void {
    this.router.navigate(['/update-task', task.idTask]);
  }

  addTask(): void{
    this.router.navigate(['/addtask'])
  }
}