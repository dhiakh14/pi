import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.css']
})
export class SupplierAddComponent implements OnInit {
  supplierForm!: FormGroup;
  materialResources: any[] = [];
  submitted = false; // Flag to check if form was submitted
  loading = false; // ✅ Added loading state
  errorMessage = ''; // ✅ Added error message state

  sentimentResult: string = '';
sentimentError: string = '';
isSummarizing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required],
      notes: [''],
      materialResourceId: [null, Validators.required],
      sentiment: [null],  // or [''] if you prefer empty string as default
    aiRating: [null]  
    });

    // Fetch material resources for the dropdown
    this.supplierService.getAllMaterialResources().subscribe(data => {
      this.materialResources = data;
    });
  }

  analyzeSentiment(): void {
    const notes = this.supplierForm.get('notes')?.value;
  
    if (!notes) {
      this.sentimentError = "Please enter notes first.";
      return;
    }
  
    this.supplierService.analyzeSentiment(notes).subscribe({
      next: (response) => {
        const sentiment = response.sentiment;
        const aiRating = sentiment === 'POSITIVE' ? 5 :
                         sentiment === 'NEUTRAL' ? 3 : 1;
  
        this.supplierForm.patchValue({
          sentiment: sentiment,
          aiRating: aiRating
        });
  
        // ✅ Set this so it displays!
        this.sentimentResult = sentiment;
        this.sentimentError = '';
      },
      error: (err) => {
        this.sentimentError = "Analysis failed. Try again.";
        this.sentimentResult = '';
      }
    });
  }
  

  /////
  

  onSubmit(): void {
    console.log("Form Values:", this.supplierForm.value);
    
    const payload = {
        ...this.supplierForm.value,
        materialResource: { idMR: this.supplierForm.value.materialResourceId }
    };
    console.log("Final Payload:", payload);

    this.supplierService.createSupplier(payload).subscribe({
        next: (response) => {
            console.log("API Response:", response);
            alert('Success! Check console for details');
        },
        error: (err) => {
            console.error("API Error:", err);
            alert('Error! Check console');
        }
    });
}
  

  goBack(): void {
    this.router.navigate(['/suppliers']);  // ✅ Navigate back to the supplier list
  }

  get f() {
    return this.supplierForm.controls;
  }
}
