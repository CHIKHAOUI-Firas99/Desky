import { TestBed } from '@angular/core/testing';

import { MapConceptorService } from './map-conceptor.service';

describe('MapConceptorService', () => {
  let service: MapConceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapConceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
