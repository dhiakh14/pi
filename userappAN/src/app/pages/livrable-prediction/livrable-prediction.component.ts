import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LivrableService } from 'src/app/servicesEmira/livrable.service';

@Component({
  selector: 'app-livrable-prediction',
  templateUrl: './livrable-prediction.component.html',
  styleUrls: ['./livrable-prediction.component.css']
})
export class LivrablePredictionComponent {
  // Champs de formulaire
  description: string = '';
  createdAt: string = '';     // Date au format yyyy-MM-dd (input type="date")
  dueDate: string = '';       // Date au format yyyy-MM-dd
  title: string = '';
  projectName: string = '';
  completedCount: number = 0;
  totalCount: number = 0;

  // Résultat
  predictedStatus: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private livrableService: LivrableService , 
    private router : Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const livrableData = {
      description: this.description,
      createdAt: this.createdAt,       // Format yyyy-MM-dd
      due_date: this.dueDate,          // Format yyyy-MM-dd
      title: this.title,
      projectName: this.projectName,
      completed_count: this.completedCount,
      total_count: this.totalCount
    };

    this.livrableService.predictLivrableStatus(livrableData).subscribe(
      (response: any) => {  // Using 'any' here for the response
        this.loading = false;
        console.log('Backend Response:', response);
        this.predictedStatus = response.predicted_status || 'No status predicted';
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while predicting the status.';
        console.error('Prediction Error:', error);
      }
    );
  }

  // Method to navigate to the Chatbot component
  navigateToChatbot() {
    this.router.navigate(['/chatbot']);  // Replace with the correct path to your chatbot
  }
}
