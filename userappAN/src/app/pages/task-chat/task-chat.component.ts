import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskControllerService } from 'src/app/services1/services';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-task-chat',
  templateUrl: './task-chat.component.html',
  styleUrls: ['./task-chat.component.css']
})
export class TaskChatComponent {
  chatForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  chatMessages: ChatMessage[] = [];
currentTime: string | number | Date | undefined;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskControllerService,
    private router: Router
  ) {
    this.chatForm = this.fb.group({
      question: ['', Validators.required]
    });

    this.chatMessages.push({
      text: 'Hello! I am your task assistant. How can I help you with your tasks today?',
      isUser: false,
      timestamp: new Date()
    });
  }

  submitQuestion(): void {
    if (this.chatForm.invalid || !this.chatForm.value.question.trim()) {
      this.errorMessage = 'Please enter a valid question.';
      return;
    }
  
    const userQuestion = this.chatForm.value.question.trim();
    this.errorMessage = '';
    
    // Add user question to chat
    this.chatMessages.push({
      text: userQuestion,
      isUser: true,
      timestamp: new Date()
    });

    this.isLoading = true;
    this.chatForm.reset();

    const params = {
      body: {
        prompt: userQuestion
      }
    };
  
    this.taskService.chatAboutTasks(params).subscribe({
      next: (response) => {
        // Add AI response to chat
        this.chatMessages.push({
          text: response,
          isUser: false,
          timestamp: new Date()
        });
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