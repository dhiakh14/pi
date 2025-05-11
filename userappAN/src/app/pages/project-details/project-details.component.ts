import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/servicesAbir/models';
import { ProjectControllerService } from 'src/app/servicesAbir/services';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  providers: [DatePipe]
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectControllerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID du projet récupéré :', id);

    if (id !== null) {
      this.projectService.findProjectById({ idProject: +id }).subscribe(
        data => {
          console.log('Données du projet :', data);
          this.project = data;

          // Transformation des dates
          if (this.project.startDate) {
            this.project.startDate = this.datePipe.transform(this.project.startDate, 'dd-MM-yyyy')!;
          }
          if (this.project.endDate) {
            this.project.endDate = this.datePipe.transform(this.project.endDate, 'dd-MM-yyyy')!;
            this.project['remainingDays'] = this.calculateRemainingDays(this.project.endDate);
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

  calculateRemainingDays(endDate: string): number {
    const today = new Date();
    const [day, month, year] = endDate.split('-').map(Number);
    const end = new Date(year, month - 1, day);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      this.router.navigate([`/editproject/${this.project.idProject}`]);
    } else {
      console.error('ID du projet non trouvé');
    }
  }

  exportToPDF(): void {
    if (!this.project) {
      console.error('No project available to export.');
      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.setTextColor('#EC744A');
    pdf.text('Détails du Projet', 10, 20);

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    let y = 40;

    pdf.text(`Project Name: ${this.project.name || ''}`, 10, y);
    y += 10;
    pdf.text(`Description: ${this.project.description || ''}`, 10, y);
    y += 10;
    pdf.text(`Start Date: ${this.project.startDate || ''}`, 10, y);
    y += 10;
    pdf.text(`End Date: ${this.project.endDate || ''}`, 10, y);
    y += 10;
    pdf.text(`Status: ${this.project.status || ''}`, 10, y);
    y += 10;
    pdf.text(`Location: ${this.project.location || ''}`, 10, y);
    y += 10;
    pdf.text(`City: ${this.project.city || ''}`, 10, y);
    y += 10;
    pdf.text(`Remaining Days: ${this.project['remainingDays'] ?? ''}`, 10, y);

    pdf.save('project-details.pdf');
  }

  goBack() {
    this.router.navigate(['/project']);
  }
  viewTasks(): void {
    if (this.project?.idProject) {
      this.router.navigate(['/tasks', this.project.idProject]);
    }
}
}
