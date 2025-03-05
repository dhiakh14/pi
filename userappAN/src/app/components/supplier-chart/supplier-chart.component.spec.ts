import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierChartComponent } from './supplier-chart.component';

describe('SupplierChartComponent', () => {
  let component: SupplierChartComponent;
  let fixture: ComponentFixture<SupplierChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierChartComponent]
    });
    fixture = TestBed.createComponent(SupplierChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
