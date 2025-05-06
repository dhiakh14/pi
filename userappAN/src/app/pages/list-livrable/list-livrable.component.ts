import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Livrable, Status } from 'src/app/common/livrable';
import { Router } from '@angular/router';
import { AddLivrableComponent } from '../add-livrable/add-livrable.component';
import{jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { LivrableService } from 'src/app/servicesEmira/livrable.service';


@Component({
  selector: 'app-list-livrable',
  templateUrl: './list-livrable.component.html',
  styleUrls: ['./list-livrable.component.css']
})
export class ListLivrableComponent implements OnInit {


  livrable!: Livrable;
  livrables: Livrable[]= [];
  statusEnum = Status;
  selectedStatus: Status | null= null;// Variable to store the selected status
  projectName: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(private livrableService: LivrableService, private router: Router
  ) { }

  ngOnInit(): void {
    this.refreshLivrables(); // Call this method to fetch livrables when the component loads
  }

  // Method to refresh the livrables list
  refreshLivrables(): void {
    this.livrableService.getLivrableList().subscribe((data) => {
      this.livrables = data;
      if (this.selectedStatus) {
        this.filterLivrablesByStatus(); // Filter livrables if a status is selected
      }
    });
    
  }
   // Method to filter livrables by status
   filterLivrablesByStatus(): void {
    if (this.selectedStatus) {
      this.livrables = this.livrables.filter(livrable => livrable.status === this.selectedStatus);
    } else {
      this.refreshLivrables(); // If no status is selected, refresh the list with all livrables
    }
  }

  // Function to get a CSS class based on the status
  getStatusClass(status: Status): string {
    switch (status) {
      case Status.COMPLETED: return 'completed';
      case Status.IN_PROGRESS: return 'in-progress';
      case Status.LATE: return 'late';
      case Status.APPROVED: return 'approved';
      case Status.REJECTED: return 'rejected';
      default: return '';
    }
  }

  // Method to view a livrable's details
  viewLivrable(id: number): void {
    this.router.navigate(['/details', id]).then(() => {
      // After navigating to details, refresh the list if needed
      // this.refreshLivrables();
    });
  }

  // Method to navigate to the Add Livrable page
  addLivrable(): void {
    this.router.navigate(['/add-livrable']);
  }

  // Method to handle status change
  onStatusChange(status: Status | null): void {
    this.selectedStatus = status;  // Update the selected status
    this.filterLivrablesByStatus(); // Filter the livrables based on the selected status
  }

  // Method to generate and download the PDF
  downloadPDF(livrable: Livrable): void {
    const doc = new jsPDF();
  
    // Add title
    doc.setFontSize(18);
    doc.text('Détails du Livrable', 10, 10);
  
    // Add logo (you can replace with your image URL or base64 encoded image)
    const logo = new Image();
    logo.src = 'assets/logo.png'; // Path to your logo image
    doc.addImage(logo, 'PNG', 150, 10, 50, 20); // (image, format, x, y, width, height)
  
    // Add livrable details with text
    doc.setFontSize(12);
    doc.text(`Titre: ${livrable.title}`, 10, 30);
    doc.text(`Projet: ${livrable.projectName}`, 10, 40);
    doc.text(`Format: ${livrable.format}`, 10, 50);
    doc.text(`Status: ${livrable.status}`, 10, 60);
    doc.text(`Description: ${livrable.description}`, 10, 70);
  
    // Add date information
    doc.text(`Créé le: ${livrable.createdAt}`, 10, 80);
    doc.text(`Echéance: ${livrable.due_date}`, 10, 90);
    doc.text(`Mise à jour: ${livrable.updatedAt}`, 10, 100);
  
    // Add a table (Example)
    const tableColumn = ['ID', 'Titre', 'Statut'];
    const tableRows = this.livrables.map(livrable => [
      livrable.idLivrable,
      livrable.title,
      livrable.status
    ]);
    
    // Draw table with the data
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 110, // Table start position
      theme: 'grid', // or 'striped'
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
    });
  
    // Save the PDF
    doc.save(`${livrable.title}_details.pdf`);
  }
}
