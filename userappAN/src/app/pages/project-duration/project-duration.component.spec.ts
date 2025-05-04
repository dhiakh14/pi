import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDurationComponent } from './project-duration.component';

describe('ProjectDurationComponent', () => {
  let component: ProjectDurationComponent;
  let fixture: ComponentFixture<ProjectDurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectDurationComponent]
    });
    fixture = TestBed.createComponent(ProjectDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
