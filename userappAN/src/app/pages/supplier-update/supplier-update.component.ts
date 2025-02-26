import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';

@Component({
  selector: 'app-supplier-update',
  templateUrl: './supplier-update.component.html',
  styleUrls: ['./supplier-update.component.css']
})
export class SupplierUpdateComponent implements OnInit {
  updateSupplierForm!: FormGroup;
  supplierId!: number;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
  
    this.updateSupplierForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],  // ✅ Ensure status is required
      notes: ['']  // ✅ Notes can be optional
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
    
        // ✅ Mark all controls as touched to ensure form validation updates
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
