import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredictProjectStatus$Params } from 'src/app/servicesAbir/fn/project-controller/predict-project-status';
import { PredictionResponseDto } from 'src/app/servicesAbir/models/prediction-response-dto';
import { ProjectDto } from 'src/app/servicesAbir/models/project-dto';
import { ProjectControllerService } from 'src/app/servicesAbir/services';
import { StatusPredictionControllerService } from 'src/app/servicesAbir/services/status-prediction-controller.service';

@Component({
  selector: 'app-prediction-statut',
  templateUrl: './prediction-statut.component.html',
  styleUrls: ['./prediction-statut.component.css']
})
export class PredictionStatutComponent {
  predictionForm: FormGroup;
  predictionResult: PredictionResponseDto | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: StatusPredictionControllerService
  ) {
    this.predictionForm = this.fb.group({
      name: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(0)]]
    });
  }

  predictStatus(): void {
    if (this.predictionForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.predictionResult = null;

    const projectData: ProjectDto = {
      name: this.predictionForm.value.name,
      duration: this.predictionForm.value.duration
    };

    this.apiService.predictStatus({ body: projectData }).subscribe({
      next: (response) => {
        this.predictionResult = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la prédiction: ' + (err.error?.message || err.message);
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.predictionForm.reset();
    this.predictionResult = null;
    this.errorMessage = null;
  }

}
