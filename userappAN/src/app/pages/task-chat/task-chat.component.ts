import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskControllerService } from 'src/app/services1/services';

@Component({
  selector: 'app-task-chat',
  templateUrl: './task-chat.component.html',
  styleUrls: ['./task-chat.component.css']
})
export class TaskChatComponent {
  chatForm: FormGroup;
  chatResponse: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskControllerService,
    private router: Router
  ) {
    this.chatForm = this.fb.group({
      question: ['', Validators.required]
    });
  }

  submitQuestion(): void {
    if (this.chatForm.invalid || !this.chatForm.value.question.trim()) {
      this.errorMessage = 'Please enter a valid question.';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    const params = {
      body: {
        prompt: this.chatForm.value.question.trim() // Ensure non-empty and trimmed
      }
    };
  
    this.taskService.chatAboutTasks(params).subscribe({
      next: (response) => {
        this.chatResponse = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to get response. Please try again.';
        this.isLoading = false;
      }
    });
  }

  goBackToTasks(): void {
    this.router.navigate(['/tasks']); 
  }
}
