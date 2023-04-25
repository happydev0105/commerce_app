import { TestBed } from '@angular/core/testing';

import { PaymentsMethodService } from './payments-method.service';

describe('PaymentsMethodService', () => {
  let service: PaymentsMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
