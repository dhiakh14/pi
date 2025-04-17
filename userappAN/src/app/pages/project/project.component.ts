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
  sortField: string = '';
  sortDirection: string = 'asc';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.http.get<Project[]>('http://localhost:8092/project/project/getAllProjects')
      .subscribe(
        (response: Project[]) => {
          this.projects = response;
          this.filterProjects();
        },
        error => console.error('Error fetching projects:', error)
      );
  }

  filterProjects(): void {
    let result = this.projects.filter(project => {
      const matchesSearch = project.name?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus ? project.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });

    if (this.sortField) {
      result.sort((a, b) => {
        const valA = new Date(a[this.sortField as keyof Project] as string).getTime();
        const valB = new Date(b[this.sortField as keyof Project] as string).getTime();
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      });
    }

    this.filteredProjects = result;
  }

  changeSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterProjects();
  }

  viewProjectDetails(id: number): void {
    this.router.navigate(['/project-details', id]);
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.http.delete(`http://localhost:8092/project/project/deleteProject/${id}`)
        .subscribe(() => {
          this.projects = this.projects.filter(p => p.idProject !== id);
          this.filterProjects();
        });
    }
  }

  navigateToAddProject(): void {
    this.router.navigate(['/addproject']);
  }
}