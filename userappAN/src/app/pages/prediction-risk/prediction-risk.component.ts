import { Component } from '@angular/core';
import { PredictionResponseDto, ProjectDto } from 'src/app/servicesAbir/models';
import { RiskPredictionControllerService } from 'src/app/servicesAbir/services';

@Component({
  selector: 'app-prediction-risk',
  templateUrl: './prediction-risk.component.html',
  styleUrls: ['./prediction-risk.component.css']
})
export class PredictionRiskComponent {
  project: ProjectDto = {
    complexity_encoded: undefined,
    duration_days: undefined,
    estimated_budget_kdt: undefined,
    team_size: undefined,
  };

  predictionResult: string | null = null;
  confidencePercent: number | null = null; // Ajout du pourcentage
  errorMessage: string | null = null;

  constructor(private predictionService: RiskPredictionControllerService) {}

  onSubmit(): void {
    this.errorMessage = null;
    this.predictionResult = null;
    this.confidencePercent = null;

    this.predictionService.predictRiskLevel({ body: this.project }).subscribe({
      next: (response: PredictionResponseDto) => {
        this.predictionResult = response.prediction ?? 'No prediction returned';

        // Option 1 : Pourcentage fixe
        this.confidencePercent = 85;

        // Option 2 : Pourcentage aléatoire entre 70 et 95 (si tu veux simuler)
        // this.confidencePercent = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Prediction failed. Please check input data or try again later.';
      }
    });
  }
}