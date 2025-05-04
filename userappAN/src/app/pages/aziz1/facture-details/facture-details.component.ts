import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/servicesAziz/services';
import { Facture } from 'src/app/servicesAziz/models';

@Component({
  selector: 'app-facture-details',
  templateUrl: './facture-details.component.html',
  styleUrls: ['./facture-details.component.css']
})
export class FactureDetailsComponent implements OnInit {
  facture: Facture | null = null;
  loading: boolean = true;
  error: string | null = null;
  isEditing: boolean = false;
  

  // Add a temporary facture object for editing
  tempFacture: Facture | null = null;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private router: Router

  ) {}


  // Toggle between view and edit mode
  editFacture(): void {
    this.isEditing = !this.isEditing;
  }
  ngOnInit(): void {
    const idF = this.route.snapshot.paramMap.get('idF'); // Get idF from route
    if (idF) {
      this.restService.retrieveById({ idF: +idF }).subscribe({
        next: (data) => {
          this.facture = data;
          
          // Ensure the dates are in Date format
            this.facture.dateemission = new Date(this.facture.dateemission).toISOString().split('T')[0];
            this.facture.dateecheance = new Date(this.facture.dateecheance).toISOString().split('T')[0];
          this.tempFacture = { ...data }; // Copy data into tempFacture for editing
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load facture details.';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'Invalid facture ID.';
      this.loading = false;
    }
  }
  
  
  

  // Submit the update form
  onSubmit(): void {
    if (this.tempFacture && this.facture) {
      const updatedFacture: Facture = {
        idF: this.facture.idF,
        number: this.tempFacture.number,
        montant: this.tempFacture.montant,
        etatFacture: this.tempFacture.etatFacture,
        dateemission: this.tempFacture.dateemission,
        dateecheance: this.tempFacture.dateecheance
      };

      this.restService.updateFacture({ body: updatedFacture }).subscribe(
        (response) => {
          this.facture = response; // Update facture with the new data
          alert('Facture updated successfully!');
          this.isEditing = false; // Hide the form after successful update
        },
        (error) => {
          this.error = 'Error updating facture: ' + error;
          alert(this.error);
        }
      );
    }
  }

  navigateToFactureList() {
    this.router.navigate(['/facture']);
  }

  

  
  
}
