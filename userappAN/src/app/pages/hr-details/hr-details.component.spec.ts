import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDetailsComponent } from './hr-details.component';

describe('HrDetailsComponent', () => {
  let component: HrDetailsComponent;
  let fixture: ComponentFixture<HrDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrDetailsComponent]
    });
    fixture = TestBed.createComponent(HrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
