import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/service-arij/supplier.service';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.css']
})
export class SupplierDetailComponent implements OnInit {
  supplier: any;
  supplierId!: number;

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supplierId = +this.route.snapshot.paramMap.get('id')!;
    this.supplierService.getSupplierById(this.supplierId).subscribe(data => {
      this.supplier = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  editSupplier(): void {
    this.router.navigate(['/supplier/update', this.supplierId]);  // ✅ Navigate to the update page
  }

  deleteSupplier(): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(this.supplierId).subscribe(() => {
        alert('Supplier deleted successfully!');
        this.router.navigate(['/suppliers']); // ✅ Redirect to suppliers list after deletion
      }, error => {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier. Please try again.');
      });
    }
  }
}
