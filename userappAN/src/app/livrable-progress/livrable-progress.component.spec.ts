import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrableProgressComponent } from './livrable-progress.component';

describe('LivrableProgressComponent', () => {
  let component: LivrableProgressComponent;
  let fixture: ComponentFixture<LivrableProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivrableProgressComponent]
    });
    fixture = TestBed.createComponent(LivrableProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
