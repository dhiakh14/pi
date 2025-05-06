import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLivrableComponent } from './list-livrable.component';

describe('ListLivrableComponent', () => {
  let component: ListLivrableComponent;
  let fixture: ComponentFixture<ListLivrableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLivrableComponent]
    });
    fixture = TestBed.createComponent(ListLivrableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
