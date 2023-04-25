import { TestBed } from '@angular/core/testing';

import { PushRelationService } from './push-relation.service';

describe('PushRelationService', () => {
  let service: PushRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushRelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
