import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/servicesAbir/models';
import { ProjectControllerService } from 'src/app/servicesAbir/services';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  project: Project | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const projectId = Number(id);
      this.projectService.findProjectById({ idProject: projectId }).subscribe(
        (data: Project) => {
          this.project = data;
        },
        (err) => {
          this.error = 'Project not found.';
        }
      );
    }
  }

  updateProject(): void {
    if (this.project) {
      const projectId = this.project.idProject;
      if (projectId) {
        this.projectService.updateProject({ idProject: projectId, body: this.project }).subscribe(
          (response) => {
            console.log('Réponse de mise à jour du projet:', response);  // Affiche la réponse pour le diagnostic
            alert('Project updated successfully!');
            this.router.navigate(['/project-details', this.project?.idProject]);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du projet:', error);  // Affiche l'erreur dans la console
            this.error = 'Error updating project: ' + error;
            alert('An error occurred while updating the project. Please try again.');
          }
        );
      } else {
        this.error = 'Project ID is invalid.';
      }
    }
  }
  
  goBack() {
    this.router.navigate(['/project']);
  }
}