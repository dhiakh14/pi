import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLocationComponent } from './project-location.component';

describe('ProjectLocationComponent', () => {
  let component: ProjectLocationComponent;
  let fixture: ComponentFixture<ProjectLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectLocationComponent]
    });
    fixture = TestBed.createComponent(ProjectLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
