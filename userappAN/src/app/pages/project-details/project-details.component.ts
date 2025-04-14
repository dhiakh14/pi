import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Project } from 'src/app/servicesAbir/models';
import { ProjectControllerService } from 'src/app/servicesAbir/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  providers: [DatePipe]  // Ajout de DatePipe dans les providers
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectControllerService,
    private datePipe: DatePipe  // Injection de DatePipe
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID du projet récupéré :', id);  // Vérification de l'ID
  
    if (id !== null) {
      this.projectService.findProjectById({ idProject: +id }).subscribe(
        data => {
          console.log('Données du projet :', data);  // Vérification des données du projet
          this.project = data;

          // Transformation des dates
          if (this.project.startDate) {
            this.project.startDate = this.datePipe.transform(this.project.startDate, 'dd-MM-yyyy')!;
          }
          if (this.project.endDate) {
            this.project.endDate = this.datePipe.transform(this.project.endDate, 'dd-MM-yyyy')!;
          }
        },
        error => {
          console.error('Erreur lors de la récupération des données du projet', error);
        }
      );
    } else {
      console.error('ID du projet est nul');
    }
  }

  updateProject(): void {
    if (this.project.idProject !== undefined) {
      this.projectService.updateProject({ idProject: this.project.idProject, body: this.project }).subscribe(
        response => {
          console.log('Projet mis à jour avec succès', response);
        },
        error => {
          console.error('Erreur lors de la mise à jour du projet', error);
        }
      );
    } else {
      console.error('ID du projet non défini');
    }
  }

  updateP() {
    if (this.project && this.project.idProject) {
      this.router.navigate([`/editproject/${this.project.idProject}`]);  // Passez l'ID du projet dans l'URL
    } else {
      console.error('ID du projet non trouvé');
    }
  }

  goBack() {
    this.router.navigate(['/project']);
  }
}