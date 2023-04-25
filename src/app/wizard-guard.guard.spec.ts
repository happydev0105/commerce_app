import { TestBed } from '@angular/core/testing';

import { WizardGuard } from './wizard-guard.guard';

describe('WizardGuard', () => {
  let guard: WizardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WizardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
