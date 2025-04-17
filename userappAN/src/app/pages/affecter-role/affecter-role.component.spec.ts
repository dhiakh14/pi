import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffecterRoleComponent } from './affecter-role.component';

describe('AffecterRoleComponent', () => {
  let component: AffecterRoleComponent;
  let fixture: ComponentFixture<AffecterRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffecterRoleComponent]
    });
    fixture = TestBed.createComponent(AffecterRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
