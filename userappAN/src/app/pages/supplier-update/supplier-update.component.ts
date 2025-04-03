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
      notes: ['']
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
          notes: supplier.notes || ''
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

    if (!notes || notes.trim() === '') {
      this.sentimentError = "Please enter notes before analyzing sentiment.";
      return;
    }

    this.sentimentResult = ''; // Clear previous result
    this.sentimentError = ''; // Clear previous error

    const apiUrl = 'http://localhost:8080/api/suppliers/analyze-sentiment';
    const headers = { 'Content-Type': 'application/json' };

    this.http.post(apiUrl, { text: notes }, { headers }).subscribe(
      (response: any) => {
        console.log("Sentiment Analysis Response:", response);
        this.sentimentResult = response.sentiment; // Store result
      },
      (error) => {
        console.error("Error analyzing sentiment:", error);
        this.sentimentError = "Failed to analyze sentiment.";
      }
    );
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
    console.log('Form Valid:', this.updateSupplierForm.valid);
    console.log('Form Errors:', this.updateSupplierForm.errors);
    console.log('Form Data:', this.updateSupplierForm.value);

    if (this.updateSupplierForm.invalid) {
      alert('Form is invalid. Check required fields.');
      return;
    }

    this.supplierService.updateSupplier(this.supplierId, this.updateSupplierForm.value).subscribe(() => {
      alert('Supplier updated successfully!');
      this.router.navigate(['/suppliers']);
    });
  }
}
