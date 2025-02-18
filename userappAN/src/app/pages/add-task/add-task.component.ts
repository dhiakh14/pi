import { Component } from '@angular/core';
import { Task } from 'src/app/services1/models';
import { TaskControllerService } from 'src/app/services1/services';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  task: Partial<Task> = {
    status: 'PENDING' // Default status
  };

  constructor(private taskService: TaskControllerService) {}

  onSubmit() {
    if (!this.task.name || !this.task.description || !this.task.startDate || !this.task.planned_end_date) {
      alert('Please fill in all fields.');
      return;
    }

    // Convert dates to ISO 8601 format
    this.task.startDate = this.convertToISO(this.task.startDate);
    this.task.planned_end_date = this.convertToISO(this.task.planned_end_date);

    // Send task to backend
    this.taskService.addTask({ body: this.task }).subscribe({
      next: (response) => {
        console.log('Task added successfully:', response);
        alert('Task added successfully!');
        this.task = { status: 'PENDING' }; // Reset task form
      },
      error: (error) => {
        console.error('Error adding task:', error);
        alert('Failed to add task.');
      }
    });
  }

  // Helper function to convert date to ISO 8601 format
  private convertToISO(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString(); // Converts date to ISO string
  }
}
