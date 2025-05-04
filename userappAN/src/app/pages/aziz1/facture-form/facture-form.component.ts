import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/servicesAziz/models';
import { RestService } from 'src/app/servicesAziz/services';

@Component({
  selector: 'app-facture-form',
  templateUrl: './facture-form.component.html',
  styleUrls: ['./facture-form.component.css']
})
export class FactureFormComponent {
  // Form group to handle the facture form
  factureForm: FormGroup;

  constructor(
    private restService: RestService, 
    private router: Router
  ) {
    this.factureForm = new FormGroup({
      dateecheance: new FormControl('', [Validators.required]),
      dateemission: new FormControl('', [Validators.required]),
      etatFacture: new FormControl('ATTENTE', [Validators.required]), // Default to 'ATTENTE'
      montant: new FormControl('', [Validators.required, Validators.min(1)]),
      number: new FormControl('')
    });
  }

  onSubmit() {
    if (this.factureForm.valid) {
      const factureData: Facture = this.factureForm.value;
  
      // Ensure the dates are formatted as required (only date, without time)
      factureData.dateecheance = factureData.dateecheance.split('T')[0]; // Removes time
      factureData.dateemission = factureData.dateemission.split('T')[0]; // Removes time
  
      // Calling the service method to add the facture
      this.restService.ajouterFacture({ body: factureData }).subscribe(
        (response) => {
          console.log('Facture added successfully:', response);
          this.router.navigate(['/facture']); // Navigate to another page after adding facture
        },
        (error) => {
          console.error('Error adding facture:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
}
