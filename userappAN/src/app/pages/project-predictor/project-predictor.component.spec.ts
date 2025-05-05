import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPredictorComponent } from './project-predictor.component';

describe('ProjectPredictorComponent', () => {
  let component: ProjectPredictorComponent;
  let fixture: ComponentFixture<ProjectPredictorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectPredictorComponent]
    });
    fixture = TestBed.createComponent(ProjectPredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
