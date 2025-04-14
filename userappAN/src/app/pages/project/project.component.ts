import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Project } from 'src/app/servicesAbir/models';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.http.get<Project[]>('http://localhost:8092/project/project/getAllProjects')
      .subscribe(
        (response: Project[]) => {
          if (response && Array.isArray(response)) {
            this.projects = response;
            this.filterProjects(); // Applique le filtre à l'initialisation
          }
        },
        (error) => {
          console.error('Erreur lors du chargement des projets :', error);
        }
      );
  }

  // Fonction de filtre
  filterProjects(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = (project.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                       project.description?.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesStatus = this.selectedStatus ? project.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });
  }

  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/project-details', projectId]);
  }

  deleteProject(projectId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.http.delete(`http://localhost:8092/project/project/deleteProject/${projectId}`).subscribe(
        () => {
          this.projects = this.projects.filter(project => project.idProject !== projectId);
          this.filterProjects(); // Applique le filtre après suppression
          console.log('Projet supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du projet:', error);
        }
      );
    }
  }

  navigateToAddProject(): void {
    this.router.navigate(['/addproject']);
  }
}
