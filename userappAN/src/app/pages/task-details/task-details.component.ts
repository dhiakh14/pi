import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskControllerService } from 'src/app/services1/services';
import { Task } from 'src/app/services1/models';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  task: Task | undefined;
  taskId: number | undefined;
  isDarkMode: boolean = false;


  constructor(
    private route: ActivatedRoute, 
    private taskService: TaskControllerService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['idTask'];  
      this.loadTaskDetails();
    });
  }

  loadTaskDetails(): void {
    if (this.taskId) {
      const params = { id: this.taskId };  
      this.taskService.getTaskById(params).subscribe(
        (response) => {
          if (response) {
            this.task = response;
          } else {
            console.error('Task not found.');
          }
        },
        (error) => {
          console.error('Error fetching task details:', error);
        }
      );
    }
  }

  setActualEndDate(): void {
    if (this.task && !this.task.actual_end_date) {  
      const currentDate = new Date().toISOString();  // Get the current date in ISO format
      this.task.actual_end_date = currentDate;  // Set the actual end date to the current date

      // Update task status to 'COMPLETED' if it's not already completed
      if (this.task.status !== 'COMPLETED') {
        this.task.status = 'COMPLETED';
      }

      // Ensure task id is not undefined before updating
      if (this.task.idTask !== undefined) {
        const updateParams = {
          idTask: this.task.idTask,
          body: this.task
        };

        this.taskService.updateTask(updateParams).subscribe(
          (response) => {
            console.log('Task updated successfully', response);
          },
          (error) => {
            console.error('Error updating task', error);
          }
        );
      } else {
        console.error('Task ID is undefined, cannot update task');
      }
    } else {
      console.log('Actual End Date is already set or Task is completed');
    }
  }

  getStatusClass(): string {
    const plannedDate = this.task?.planned_end_date ? new Date(this.task.planned_end_date) : null;
    const actualDate = this.task?.actual_end_date ? new Date(this.task.actual_end_date) : null;

    if (!actualDate) {
      return ''; // No actual end date set, no class needed
    }

    if (plannedDate && actualDate > plannedDate) {
      return 'late'; // Late
    } else if (plannedDate && actualDate < plannedDate) {
      return 'early'; // Early
    } else {
      return 'on-time'; // On Time
    }
  }

  getStatusMessage(): string {
    const plannedDate = this.task?.planned_end_date ? new Date(this.task.planned_end_date) : null;
    const actualDate = this.task?.actual_end_date ? new Date(this.task.actual_end_date) : null;

    if (!actualDate) {
      return '';
    }

    if (plannedDate && actualDate > plannedDate) {
      return 'Late';
    } else if (plannedDate && actualDate < plannedDate) {
      return 'Early';
    } else {
      return 'In Date';
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}