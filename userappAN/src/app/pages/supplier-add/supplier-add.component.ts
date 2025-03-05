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
      materialResourceId: [null, Validators.required]
    });

    // Fetch material resources for the dropdown
    this.supplierService.getAllMaterialResources().subscribe(data => {
      this.materialResources = data;
    });
  }

  /////
  

  onSubmit(): void {
    this.submitted = true;

    if (this.supplierForm.invalid) {
      return;
    }

    const supplierData = {
      ...this.supplierForm.value,
      materialResource: { idMR: this.supplierForm.value.materialResourceId }
    };

    this.supplierService.createSupplier(supplierData).subscribe(
      (response) => {
        alert('Supplier added successfully!');
        this.router.navigate(['/suppliers']);
      },
      (error) => {
        console.error('Error adding supplier:', error);
        alert('There was an error adding the supplier. Please try again.');
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);  // ✅ Navigate back to the supplier list
  }

  get f() {
    return this.supplierForm.controls;
  }
}
