import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/servicesAziz/models';
import { ServiceML } from 'src/app/servicesAziz/serviceML';
import { RestService } from 'src/app/servicesAziz/services';

@Component({
  selector: 'app-facture-form',
  templateUrl: './facture-form.component.html',
  styleUrls: ['./facture-form.component.css']
})
export class FactureFormComponent {
  factureForm: FormGroup;
  suggestedDateEcheance: string = '';


  constructor(
    private restService: RestService, 
    private router: Router,
    private serviceML: ServiceML,
  ) {
    this.factureForm = new FormGroup({
      dateecheance: new FormControl('', [Validators.required]),
      dateemission: new FormControl('', [Validators.required]),
      etatFacture: new FormControl('ATTENTE', [Validators.required]), // Default to 'ATTENTE'
      montant: new FormControl('', [Validators.required, Validators.min(1)]),
      number: new FormControl('')
    });

    this.factureForm.get('dateemission')?.valueChanges.subscribe(date => {
      this.tryPredictEcheance();
    });
    
    this.factureForm.get('montant')?.valueChanges.subscribe(montant => {
      this.tryPredictEcheance();
    });
  }

  onSubmit() {
    if (this.factureForm.valid) {
      const factureData: Facture = this.factureForm.value;
  
      factureData.dateecheance = factureData.dateecheance.split('T')[0]; 
      factureData.dateemission = factureData.dateemission.split('T')[0]; 
  
      this.restService.ajouterFacture({ body: factureData }).subscribe(
        (response) => {
          console.log('Facture added successfully:', response);
          this.router.navigate(['/facture']); 
        },
        (error) => {
          console.error('Error adding facture:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  tryPredictEcheance(): void {
    const dateEmission = this.factureForm.get('dateemission')?.value;
    const montant = this.factureForm.get('montant')?.value;
  
    if (dateEmission && montant > 0) {
      this.serviceML.predictDateEcheance(montant, dateEmission).subscribe({
        next: (predictedDate: string) => {
          const dateRegex = /\d{4}-\d{2}-\d{2}/;
          const match = predictedDate.match(dateRegex);
          if (match) {
            this.suggestedDateEcheance = match[0]; 
          } else {
            this.suggestedDateEcheance = ''; 
          }
        },
        error: (err) => {
          console.error('Erreur lors de la prédiction :', err);
          this.suggestedDateEcheance = '';
        }
      });
    } else {
      this.suggestedDateEcheance = '';
    }
  }
  
  
  
  
}
