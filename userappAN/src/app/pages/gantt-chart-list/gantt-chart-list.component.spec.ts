import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttChartListComponent } from './gantt-chart-list.component';

describe('GanttChartListComponent', () => {
  let component: GanttChartListComponent;
  let fixture: ComponentFixture<GanttChartListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GanttChartListComponent]
    });
    fixture = TestBed.createComponent(GanttChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
