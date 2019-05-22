import { TestBed } from '@angular/core/testing';

import { Routes.GuardService } from './routes.guard.service';

describe('Routes.GuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Routes.GuardService = TestBed.get(Routes.GuardService);
    expect(service).toBeTruthy();
  });
});
