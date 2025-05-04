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

  inputData: PredictProjectStatus$Params = {
    body: {
      idProject: 26
    }
  };

  constructor(private projectService: ProjectControllerService) {}

  predictStatus(): void {
    this.isLoading = true;
    this.predictionResult = null;

    (this.projectService as any).predictProjectStatus(this.inputData).subscribe({
      next: (response: string) => {
        this.predictionResult = response;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors de la prédiction :', err);
        this.predictionResult = 'Erreur de prédiction.';
        this.isLoading = false;
      }
    });
  }
}
