import { TestBed } from '@angular/core/testing';

import { LayerVisibilityServiceService } from './layer-visibility-service.service';

describe('LayerVisibilityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayerVisibilityServiceService = TestBed.get(LayerVisibilityServiceService);
    expect(service).toBeTruthy();
  });
});
