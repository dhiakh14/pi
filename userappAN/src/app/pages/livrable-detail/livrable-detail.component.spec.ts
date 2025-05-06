import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrableDetailComponent } from './livrable-detail.component';

describe('LivrableDetailComponent', () => {
  let component: LivrableDetailComponent;
  let fixture: ComponentFixture<LivrableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivrableDetailComponent]
    });
    fixture = TestBed.createComponent(LivrableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
