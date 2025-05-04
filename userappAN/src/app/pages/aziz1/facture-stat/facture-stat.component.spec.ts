import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureStatComponent } from './facture-stat.component';

describe('FactureStatComponent', () => {
  let component: FactureStatComponent;
  let fixture: ComponentFixture<FactureStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactureStatComponent]
    });
    fixture = TestBed.createComponent(FactureStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
