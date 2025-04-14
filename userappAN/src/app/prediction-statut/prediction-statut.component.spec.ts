import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionStatutComponent } from './prediction-statut.component';

describe('PredictionStatutComponent', () => {
  let component: PredictionStatutComponent;
  let fixture: ComponentFixture<PredictionStatutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionStatutComponent]
    });
    fixture = TestBed.createComponent(PredictionStatutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
