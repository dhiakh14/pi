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
        console.log('Task loaded:', this.task);

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
          console.log('Task updated successfully:', response);
          alert('Task updated successfully!');
          this.router.navigate(['/tasks']); 
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
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');  
    const day = parsedDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  

  Back(): void{
    this.router.navigate(['/tasks'])
  }
}
