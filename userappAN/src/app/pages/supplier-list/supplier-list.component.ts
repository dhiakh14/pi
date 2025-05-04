import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  searchText: string = '';
  

  constructor(private supplierService: SupplierService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      const newThisMonth = params['newThisMonth'] === 'true';
  
      if (newThisMonth) {
        this.loadSuppliers(undefined, true);
      } else if (status) {
        this.loadSuppliers(status);
      } else {
        this.loadSuppliers();
      }
    });
  }

  loadSuppliers(status?: string, newThisMonth: boolean = false): void {
    this.supplierService.getSuppliers().subscribe(
      (data) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
  
        this.suppliers = data.filter(supplier => {
          if (status) {
            return supplier.status === status;
          }
  
          if (newThisMonth) {
            const created = new Date(supplier.createdAt);
            return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
          }
  
          return true;
        });
  
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching suppliers:', error);
        this.errorMessage = 'Failed to load suppliers.';
        this.isLoading = false;
      }
    );
  }

  //////
  
  
  
  



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

  

  filteredSuppliers() {
    return this.suppliers.filter(supplier =>
      (supplier.name?.toLowerCase() ?? '').includes(this.searchText.toLowerCase()) ||
      (supplier.address?.toLowerCase() ?? '').includes(this.searchText.toLowerCase()) ||
      (supplier.materialResource?.firstName?.toLowerCase() ?? '').includes(this.searchText.toLowerCase())
    );
  }
  
  

  navigateToAddSupplier(): void {
    this.router.navigate(['/add-supplier']);  // ✅ Navigate to add supplier page
  }

  viewSupplier(id: number): void {
    
    this.supplierService.incrementClickCount(id).subscribe(() => {
      this.router.navigate(['/supplier', id]);
 // Navigate to details page
    });
  }




  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  
  
}
