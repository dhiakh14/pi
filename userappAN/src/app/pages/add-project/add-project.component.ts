import { Component } from '@angular/core';
import { Project } from 'src/app/servicesAbir/models';
import { ProjectControllerService } from 'src/app/servicesAbir/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  project: Partial<Project> = {
    status: 'ON_GOING'
  };
  formSubmitted: boolean = false;

  constructor(private projectService: ProjectControllerService, private router: Router) {}

  onSubmit() {
    this.formSubmitted = true;

    // Vérification des champs obligatoires
    if (!this.project.name || !this.project.description || !this.project.startDate || !this.project.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    // Vérification et conversion des dates en format ISO (chaîne)
    this.project.startDate = this.convertToISO(this.project.startDate);
    this.project.endDate = this.convertToISO(this.project.endDate);

    // Envoi du projet au backend
    this.projectService.addProject({ body: this.project as Project }).subscribe({
      next: (response) => {
        console.log('Project added successfully:', response);
        alert('Project added successfully!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding project:', error);
        if (error.status === 0) {
          alert('Server connection error. Please make sure the backend is running and accessible.');
        } else {
          alert('Failed to add project. Details: ' + error.message);
        }
      }
    });
  }

  // Méthode de conversion de la date en format ISO (chaîne)
  private convertToISO(date: any): string {
    if (date instanceof Date) {
      return date.toISOString(); // Retourne la date au format ISO si elle est déjà un objet Date
    } else if (typeof date === 'string') {
      return new Date(date).toISOString(); // Si c'est une chaîne, on la convertit en Date puis en ISO
    }
    return ''; // Retourne une chaîne vide si la date n'est pas valide
  }

  resetForm() {
    this.project = { status: 'ON_GOING' };
    this.formSubmitted = false;
  }

  goBack() {
    this.router.navigate(['/project']);
  }
}
