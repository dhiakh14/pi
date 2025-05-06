import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrableChartComponent } from './livrable-chart.component';

describe('LivrableChartComponent', () => {
  let component: LivrableChartComponent;
  let fixture: ComponentFixture<LivrableChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivrableChartComponent]
    });
    fixture = TestBed.createComponent(LivrableChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
