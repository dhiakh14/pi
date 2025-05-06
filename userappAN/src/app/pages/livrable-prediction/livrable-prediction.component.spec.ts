import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrablePredictionComponent } from './livrable-prediction.component';

describe('LivrablePredictionComponent', () => {
  let component: LivrablePredictionComponent;
  let fixture: ComponentFixture<LivrablePredictionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivrablePredictionComponent]
    });
    fixture = TestBed.createComponent(LivrablePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
