import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHRComponent } from './add-hr.component';

describe('AddHRComponent', () => {
  let component: AddHRComponent;
  let fixture: ComponentFixture<AddHRComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHRComponent]
    });
    fixture = TestBed.createComponent(AddHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
