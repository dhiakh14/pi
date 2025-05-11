import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPredictionDetailsComponent } from './supplier-prediction-details.component';

describe('SupplierPredictionDetailsComponent', () => {
  let component: SupplierPredictionDetailsComponent;
  let fixture: ComponentFixture<SupplierPredictionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierPredictionDetailsComponent]
    });
    fixture = TestBed.createComponent(SupplierPredictionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
