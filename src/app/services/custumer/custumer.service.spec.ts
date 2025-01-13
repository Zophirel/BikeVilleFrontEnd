import { TestBed } from '@angular/core/testing';

import { CustumerService } from './custumer.service';

describe('CustumerService', () => {
  let service: CustumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
