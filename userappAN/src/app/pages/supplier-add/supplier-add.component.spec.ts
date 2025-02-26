import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAddComponent } from './supplier-add.component';

describe('SupplierAddComponent', () => {
  let component: SupplierAddComponent;
  let fixture: ComponentFixture<SupplierAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierAddComponent]
    });
    fixture = TestBed.createComponent(SupplierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
