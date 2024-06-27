import { TestBed } from '@angular/core/testing';

import { ResourceOverviewService } from './resource-overview.service';

describe('ResourceOverviewService', () => {
  let service: ResourceOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
