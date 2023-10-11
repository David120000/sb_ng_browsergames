import { TestBed } from '@angular/core/testing';

import { RestAccessService } from './rest-access.service';

describe('RestAccessService', () => {
  let service: RestAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
