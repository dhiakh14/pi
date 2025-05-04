import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-supplier-card',
  templateUrl: './supplier-card.component.html',
  styleUrls: ['./supplier-card.component.css']
})
export class SupplierCardComponent {
  @Input() supplier: any;
  @Output() delete = new EventEmitter<number>();

  constructor(public router: Router) {}

  onDelete(): void {
    this.delete.emit(this.supplier.idSupplier);
  }
  updateSupplier() {
    this.router.navigate(['/supplier/update', this.supplier.idSupplier]);
  }
}
