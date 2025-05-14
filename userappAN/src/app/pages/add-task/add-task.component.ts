import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CameraService } from 'src/app/services/CameraService ';
import { Task } from 'src/app/services1/models';
import { TaskControllerService } from 'src/app/services1/services';
import { serviceFeignAD } from 'src/app/servicesAbir/services/serviceFeignAD';

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
  predictionData: any = {
    name: '',
    description: '',
    effectif: null,
    niveau_complexity: 'medium'
  };
  

  constructor(
    private taskService: TaskControllerService,
    private router: Router,
    private route: ActivatedRoute ,
    private cameraService: CameraService,
    private serviceDA: serviceFeignAD
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

    this.route.queryParamMap.subscribe(params => {
      const projectId = params.get('projectId');
      if (projectId) {
        this.task.projectId = +projectId;
      }
    });
  }

  openHelpModal() {
    this.predictionData = {
      name: this.task.name || '',
      description: this.task.description || '',
      effectif: null,  
      niveau_complexity: 'medium'  
    };
    
    
    const modal = new (window as any).bootstrap.Modal(document.getElementById('helpModal'));
    modal.show();
  }

  getPrediction() {
    if (!this.predictionData.name || !this.predictionData.description || 
        !this.predictionData.effectif || !this.predictionData.niveau_complexity) {
      alert('Please fill all fields to get a prediction');
      return;
    }
  
    this.cameraService.predictTaskDuration(
      this.predictionData.name,
      this.predictionData.description,
      this.predictionData.effectif,
      this.predictionData.niveau_complexity
    ).subscribe({
      next: (response) => {
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
          const resultDiv = document.createElement('div');
          resultDiv.className = 'prediction-result';
          resultDiv.innerHTML = `
            <p>Predicted Duration: <strong>${response.predicted_duration_days} days</strong></p> `;
          chatMessages.appendChild(resultDiv);
        } else {
          console.error('Chat messages container not found.');
        }
      },
      error: (err) => {
        console.error('Prediction failed:', err);
        alert('Failed to get prediction. Please try again.');
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

  

  onSubmit(): void {
    if (!this.task.name || !this.task.description || !this.task.startDate || !this.task.planned_end_date) {
      alert('Please fill in all fields.');
      return;
    }
  
    this.task.startDate = this.convertToISO(this.task.startDate);
    this.task.planned_end_date = this.convertToISO(this.task.planned_end_date);
    if (!this.task.projectId) {
      alert('Project ID is missing.');
      return;
    }
    

  
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
      this.serviceDA.addTasksToProject(this.task.projectId, [this.task as Task]).subscribe({
        next: (response) => {
          alert('Task added to project successfully!');
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          alert('Failed to add task to project.');
          console.error(error);
        }
      });
    }
  }
  
  private convertToISO(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }

  Back(): void {
    this.router.navigate(['/project'])
  }
}