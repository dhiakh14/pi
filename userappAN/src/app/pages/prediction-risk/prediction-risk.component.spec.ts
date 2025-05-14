import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionRiskComponent } from './prediction-risk.component';

describe('PredictionRiskComponent', () => {
  let component: PredictionRiskComponent;
  let fixture: ComponentFixture<PredictionRiskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionRiskComponent]
    });
    fixture = TestBed.createComponent(PredictionRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
