import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivPerProjComponent } from './liv-per-proj.component';

describe('LivPerProjComponent', () => {
  let component: LivPerProjComponent;
  let fixture: ComponentFixture<LivPerProjComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivPerProjComponent]
    });
    fixture = TestBed.createComponent(LivPerProjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
