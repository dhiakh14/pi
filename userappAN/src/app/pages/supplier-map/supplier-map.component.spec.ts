import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMapComponent } from './supplier-map.component';

describe('SupplierMapComponent', () => {
  let component: SupplierMapComponent;
  let fixture: ComponentFixture<SupplierMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierMapComponent]
    });
    fixture = TestBed.createComponent(SupplierMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
