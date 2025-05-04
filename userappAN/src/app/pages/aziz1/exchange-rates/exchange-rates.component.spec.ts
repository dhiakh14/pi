import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRatesComponent } from './exchange-rates.component';

describe('ExchangeRatesComponent', () => {
  let component: ExchangeRatesComponent;
  let fixture: ComponentFixture<ExchangeRatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeRatesComponent]
    });
    fixture = TestBed.createComponent(ExchangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
