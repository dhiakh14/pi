import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/services1/models';
import { TaskControllerService } from 'src/app/services1/services';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  task: Partial<Task> = {
    status: 'PENDING' 
  };
  isEditMode: boolean = false; 
  taskId?: number;

  constructor(
    private taskService: TaskControllerService,
    private router: Router,
    private route: ActivatedRoute // To fetch the task ID from the URL
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // Get 'id' param from the route
      if (id) {
        this.taskId = +id; // Convert to number and store the task ID
        this.isEditMode = true; // Set edit mode to true since we are editing
        this.loadTask(this.taskId); // Fetch the task data using the task ID
      }
    });
  }

  // Fetch task data from the backend
  loadTask(id: number): void {
    this.taskService.getTaskById({ id }).subscribe({
      next: (task) => {
        this.task = task; // Populate task data for editing
        console.log('Task loaded:', this.task); // For debugging purposes
      },
      error: (err) => console.error('Error loading task:', err)
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (!this.task.name || !this.task.description || !this.task.startDate || !this.task.planned_end_date) {
      alert('Please fill in all fields.');
      return;
    }

    // Convert dates to ISO format before saving
    this.task.startDate = this.convertToISO(this.task.startDate);
    this.task.planned_end_date = this.convertToISO(this.task.planned_end_date);

    // Check if we're editing or adding a new task
    if (this.isEditMode && this.taskId) {
      // Update task if in edit mode
      this.taskService.updateTask({ idTask: this.taskId, body: this.task }).subscribe({
        next: (response) => {
          console.log('Task updated successfully:', response);
          alert('Task updated successfully!');
          this.router.navigate(['/tasks']); // Redirect to task list
        },
        error: (error) => {
          console.error('Error updating task:', error);
          alert('Failed to update task.');
        }
      });
    } else {
      this.taskService.addTask({ body: this.task }).subscribe({
        next: (response) => {
          console.log('Task added successfully:', response);
          alert('Task added successfully!');
          this.task = { status: 'PENDING' }; 
          this.router.navigate(['/tasks']); 
        },
        error: (error) => {
          console.error('Error adding task:', error);
          alert('Failed to add task.');
        }
      });
    }
  }

  private convertToISO(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString(); 
  }

  Back(): void{
    this.router.navigate(['/tasks'])
  }
}
