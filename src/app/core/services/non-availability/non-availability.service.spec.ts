import { TestBed } from '@angular/core/testing';

import { NonAvailabilityService } from './non-availability.service';

describe('NonAvailabilityService', () => {
  let service: NonAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
