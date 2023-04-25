import { TestBed } from '@angular/core/testing';

import { CustomerNotesService } from './customer-notes.service';

describe('CustomerNotesService', () => {
  let service: CustomerNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
