import { Component } from '@angular/core';
import { PredictProjectStatus$Params } from 'src/app/servicesAbir/fn/project-controller/predict-project-status';
import { ProjectControllerService } from 'src/app/servicesAbir/services';

@Component({
  selector: 'app-prediction-statut',
  templateUrl: './prediction-statut.component.html',
  styleUrls: ['./prediction-statut.component.css']
})
export class PredictionStatutComponent {
  predictionResult: string | null = null;
  isLoading: boolean = false;

  // Donnée correctement formatée pour le service
  inputData: PredictProjectStatus$Params = {
    body: {
      idProject: 1
    }
  };

  constructor(private projectService: ProjectControllerService) {}

  predictStatus(): void {
    this.isLoading = true;
    this.predictionResult = null;

    this.projectService.predictProjectStatus(this.inputData).subscribe({
      next: (result: string) => {
        this.predictionResult = result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la prédiction :', err);
        this.predictionResult = 'Erreur de prédiction.';
        this.isLoading = false;
      }
    });
  }
}