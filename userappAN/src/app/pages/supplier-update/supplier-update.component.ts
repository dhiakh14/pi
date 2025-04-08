import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-supplier-update',
  templateUrl: './supplier-update.component.html',
  styleUrls: ['./supplier-update.component.css']
})
export class SupplierUpdateComponent implements OnInit {
  updateSupplierForm!: FormGroup;
  supplierId!: number;
  sentimentResult: string = '';
  sentimentError: string = '';
  errorMessage: string = '';  
  isSummarizing: boolean = false;  

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient // ✅ Ensure HttpClient is injected
  ) {}

  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize the form
    this.updateSupplierForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      notes: [''],
      sentiment: [''] // ✅ Add this

    });

    // Fetch supplier details and populate the form
    this.supplierService.getSupplierById(this.supplierId).subscribe((supplier) => {
      if (supplier) {
        console.log('Fetched supplier:', supplier);

        this.updateSupplierForm.patchValue({
          name: supplier.name,
          address: supplier.address,
          phoneNumber: supplier.phoneNumber,
          email: supplier.email,
          status: supplier.status || 'ACTIVE',
          notes: supplier.notes || '',
          sentiment: supplier.sentiment || '',  // ✅ Add this
          aiRating: supplier.aiRating || 0    
        });

        // ✅ Mark all controls as touched to ensure validation updates
        Object.keys(this.updateSupplierForm.controls).forEach((field) => {
          const control = this.updateSupplierForm.get(field);
          if (control) {
            control.markAsTouched();
            control.updateValueAndValidity();
          }
        });

        console.log('Form after patchValue:', this.updateSupplierForm.value);
      }
    });
  }

  analyzeSentiment(): void {
    const notes = this.updateSupplierForm.get('notes')?.value;
  
    if (!notes) {
      this.sentimentError = "Please enter notes first.";
      return;
    }
  
    this.supplierService.analyzeSentiment(notes).subscribe({
      next: (response) => {
        const sentiment = response.sentiment;
        const aiRating = sentiment === 'POSITIVE' ? 5 : 
                         sentiment === 'NEUTRAL' ? 3 : 1;
  
        // ✅ Update form fields
        this.updateSupplierForm.patchValue({
          sentiment: sentiment,
          aiRating: aiRating
        });
      },
      error: (err) => {
        this.sentimentError = "Analysis failed. Try again.";
      }
    });
  }

  summarizeNotes(): void {
    const notes = this.updateSupplierForm.get('notes')?.value;
  
    if (!notes || notes.trim() === '') {
      this.errorMessage = "Please enter notes before summarizing.";
      return;
    }
  
    this.isSummarizing = true;
    this.errorMessage = '';
  
    const apiUrl = 'http://localhost:8080/api/suppliers/summarize';
    const headers = { 'Content-Type': 'application/json' };
    const requestBody = { inputs: notes }; // ✅ Ensure correct key
  
    this.http.post(apiUrl, requestBody, { headers }).subscribe(
      (response: any) => {
        console.log("Summarization Response:", response);
        this.isSummarizing = false;
  
        if (response.summary) {
          this.updateSupplierForm.patchValue({ notes: response.summary });
        } else {
          this.errorMessage = "Summarization failed.";
        }
      },
      (error) => {
        console.error("Summarization Error:", error);
        this.isSummarizing = false;
        this.errorMessage = "Failed to summarize notes.";
      }
    );
  }
  

  onUpdate() {
    if (this.updateSupplierForm.invalid) {
        alert('Form is invalid. Check required fields.');
        return;
    }

    const updateData = {
        ...this.updateSupplierForm.value,
        aiRating: this.updateSupplierForm.get('aiRating')?.value, // Add this
        sentiment: this.updateSupplierForm.get('sentiment')?.value // Add this
    };

    this.supplierService.updateSupplier(this.supplierId, updateData).subscribe(() => {
        alert('Supplier updated successfully!');
        this.router.navigate(['/suppliers']);
    });
}
}
