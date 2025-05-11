import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMatComponent } from './add-mat.component';

describe('AddMatComponent', () => {
  let component: AddMatComponent;
  let fixture: ComponentFixture<AddMatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMatComponent]
    });
    fixture = TestBed.createComponent(AddMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
