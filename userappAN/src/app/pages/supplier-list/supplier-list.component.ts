import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  suppliers: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private supplierService: SupplierService, private router: Router) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
        this.errorMessage = 'Failed to load suppliers.';
        this.isLoading = false;
      }
    );
  }

  viewSupplier(id: number): void {
    this.router.navigate(['/supplier', id]);  // ✅ Navigate to supplier details
  }

  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => {
        this.suppliers = this.suppliers.filter(supplier => supplier.idSupplier !== id);
        alert('Supplier deleted successfully!');
      }, error => {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier.');
      });
    }
  }

  navigateToAddSupplier(): void {
    this.router.navigate(['/add-supplier']);  // ✅ Navigate to add supplier page
  }
}
