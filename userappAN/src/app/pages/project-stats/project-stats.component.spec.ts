import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatsComponent } from './project-stats.component';

describe('ProjectStatsComponent', () => {
  let component: ProjectStatsComponent;
  let fixture: ComponentFixture<ProjectStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectStatsComponent]
    });
    fixture = TestBed.createComponent(ProjectStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
