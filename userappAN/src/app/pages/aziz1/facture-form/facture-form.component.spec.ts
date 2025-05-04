import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureFormComponent } from './facture-form.component';

describe('FactureFormComponent', () => {
  let component: FactureFormComponent;
  let fixture: ComponentFixture<FactureFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactureFormComponent]
    });
    fixture = TestBed.createComponent(FactureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
