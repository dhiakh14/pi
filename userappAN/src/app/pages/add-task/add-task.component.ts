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
  suggestedDuration?: number;
  isPredicting: boolean = false;

  constructor(
    private taskService: TaskControllerService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      if (id) {
        this.taskId = +id; 
        this.isEditMode = true; 
        this.loadTask(this.taskId); 
      }
    });
  }

  loadTask(id: number): void {
    this.taskService.getTaskById({ id }).subscribe({
      next: (task) => {
        this.task = task;
        if (this.task.startDate) {
          this.task.startDate = this.convertToISO(this.task.startDate);
        }
        if (this.task.planned_end_date) {
          this.task.planned_end_date = this.convertToISO(this.task.planned_end_date);
        }
      },
      error: (err) => console.error('Error loading task:', err)
    });
  }

  predictDuration(): void {
    if (!this.task.name || !this.task.description) {
      this.suggestedDuration = undefined;
      return;
    }

    this.isPredicting = true;
    const requestBody = {
      name: this.task.name,
      description: this.task.description
    };

    this.taskService.predictDuration({ body: requestBody }).subscribe({
      next: (response) => {
        this.suggestedDuration = Object.values(response)[0];
        this.isPredicting = false;
      },
      error: (error) => {
        console.error('Error predicting duration:', error);
        this.isPredicting = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.task.name || !this.task.description || !this.task.startDate || !this.task.planned_end_date) {
      alert('Please fill in all fields.');
      return;
    }
  
    this.task.startDate = this.convertToISO(this.task.startDate);
    this.task.planned_end_date = this.convertToISO(this.task.planned_end_date);
  
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask({ idTask: this.taskId, body: this.task }).subscribe({
        next: (response) => {
          alert('Task updated successfully!');
          this.router.navigate(['/tasks']); 
        },
        error: (error) => {
          alert('Failed to update task.');
        }
      });
    } else {
      this.taskService.addTask({ body: this.task }).subscribe({
        next: (response) => {
          alert('Task added successfully!');
          this.router.navigate(['/tasks']); 
        },
        error: (error) => {
          alert('Failed to add task.');
        }
      });
    }
  }
  
  private convertToISO(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }

  Back(): void {
    this.router.navigate(['/tasks'])
  }
}