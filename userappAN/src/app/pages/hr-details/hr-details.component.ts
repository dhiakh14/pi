import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HumanResources } from 'src/app/ServiceMaram/models';
import { HumanResourcesRestControllerService } from 'src/app/ServiceMaram/services';

@Component({
  selector: 'app-hr-details',
  templateUrl: './hr-details.component.html',
  styleUrls: ['./hr-details.component.css']
})
export class HrDetailsComponent implements OnInit {
  selectedHr: HumanResources | null = null;
  isEditMode: boolean = false;  // Flag to toggle edit form visibility

  constructor(
    private route: ActivatedRoute,
    private hrService: HumanResourcesRestControllerService
  ) {}

  ngOnInit(): void {
    // Get the ID from the URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Call the service to fetch HR details by ID
      this.hrService.findById1({ id: Number(id) }).subscribe({
        next: (data) => {
          this.selectedHr = data;
        },
        error: (err) => {
          console.error('Error fetching HR details:', err);
        }
      });
    }
  }

  // Method to toggle the edit mode
  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  // Method to save the updated HR details
  saveUpdatedHr(): void {
    if (this.selectedHr) {
      this.hrService.updateHr({ idHR: this.selectedHr.idHR, body: this.selectedHr }).subscribe({
        next: (updatedData) => {
          this.selectedHr = updatedData;
          this.isEditMode = false;  // Turn off edit mode after successful update
        },
        error: (err) => {
          console.error('Error updating HR details:', err);
        }
      });
    }
  }
}
