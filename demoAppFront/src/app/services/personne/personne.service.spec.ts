import { TestBed } from '@angular/core/testing';

import { PersonneService } from '../personne/personne.service';

describe('ClinetService', () => {
  let service: PersonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
