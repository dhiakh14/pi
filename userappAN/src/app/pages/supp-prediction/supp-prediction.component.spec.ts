import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppPredictionComponent } from './supp-prediction.component';

describe('SuppPredictionComponent', () => {
  let component: SuppPredictionComponent;
  let fixture: ComponentFixture<SuppPredictionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuppPredictionComponent]
    });
    fixture = TestBed.createComponent(SuppPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
