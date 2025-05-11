import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HumanResources } from 'src/app/ServiceMaram/models';
import { HumanResourcesRestControllerService } from 'src/app/ServiceMaram/services';
import { ExcelExportService } from 'src/app/services/excel-export.service'; // Import the ExcelExportService

@Component({
  selector: 'app-list-hr',
  templateUrl: './list-hr.component.html',
  styleUrls: ['./list-hr.component.css'],
})
export class ListHrComponent implements OnInit {
  humanResources: HumanResources[] = []; // Original list of human resources
  filteredHumanResources: HumanResources[] = []; // Filtered list for display

  // Search and filter properties
  searchFirstName: string = ''; // Search by first name
  selectedJobRole: string = ''; // Filter by job role
  jobRoles: string[] = ['MASON', 'ELECTRICIAN', 'PLUMBER', 'ING']; // List of job roles

  // Sorting properties
  sortColumn: string = ''; // Current column to sort by
  sortDirection: boolean = true; // true = ascending, false = descending

  constructor(
    private router: Router,
    private hrService: HumanResourcesRestControllerService,
    private excelExportService: ExcelExportService // Inject the ExcelExportService
  ) {}

  ngOnInit(): void {
    this.loadHumanResources(); // Load human resources when the component initializes
  }

  // Fetch all human resources
  loadHumanResources(): void {
    console.log('Fetching Human Resources...'); // Debugging
    this.hrService.findAll1().subscribe({
      next: (data: HumanResources[]) => {
        console.log('Human Resources fetched:', data); // Debugging
        this.humanResources = data;
        this.filteredHumanResources = [...this.humanResources];
      },
      error: (err) => {
        console.error('Error fetching Human Resources:', err);
        alert('Failed to load Human Resources.');
      },
    });
  }

  // Filter human resources by first name and job role
  filterHumanResources(): void {
    this.filteredHumanResources = this.humanResources.filter((hr) => {
      const matchesFirstName = hr.name
        .toLowerCase()
        .includes(this.searchFirstName.toLowerCase());

      const matchesJobRole = this.selectedJobRole
        ? hr.job_Role === this.selectedJobRole
        : true;

      return matchesFirstName && matchesJobRole;
    });

    // Apply sorting after filtering
    if (this.sortColumn) {
      this.sortHumanResources(this.sortColumn);
    }
  }

  // Sort human resources by column
  sortHumanResources(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection; // Toggle sorting direction
    } else {
      this.sortColumn = column;
      this.sortDirection = true; // Default to ascending order
    }

    this.filteredHumanResources.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection ? -1 : 1;
      if (valueA > valueB) return this.sortDirection ? 1 : -1;
      return 0;
    });
  }

  // Delete human resource
  deleteHr(idHR: number): void {
    if (idHR === undefined) {
      console.error('Invalid ID: idHR is undefined');
      alert('Invalid ID. Cannot delete this Human Resource.');
      return;
    }

    if (confirm('Are you sure you want to delete this Human Resource?')) {
      this.hrService.deleteHr({ id: idHR }).subscribe({
        next: () => {
          alert('Human Resource deleted successfully!');
          this.loadHumanResources(); // Refresh the list after deletion
        },
        error: (error) => {
          console.error('Error deleting Human Resource:', error);
          alert('Failed to delete Human Resource. Please try again.');
        },
      });
    }
  }

  // Navigate to HR details page
  findById(id: number): void {
    this.router.navigate(['/hr-details', id]);
  }

  // Export filtered human resources to Excel
  exportToExcel(): void {
    this.excelExportService.exportToExcel(
      this.filteredHumanResources,
      'Human_Resources_Report',
      'HR Data'
    );
  }
}