import { TestBed } from '@angular/core/testing';

import { ShortCutHandlerService } from './short-cut-handler.service';

describe('ShortCutHandlerService', () => {
  let service: ShortCutHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortCutHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
