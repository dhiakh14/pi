import { TestBed } from '@angular/core/testing';

import { LivrableAlertService } from './livrable-alert.service';

describe('LivrableAlertService', () => {
  let service: LivrableAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivrableAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
