import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedComponentComponent } from './access-denied-component.component';

describe('AccessDeniedComponentComponent', () => {
  let component: AccessDeniedComponentComponent;
  let fixture: ComponentFixture<AccessDeniedComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccessDeniedComponentComponent]
    });
    fixture = TestBed.createComponent(AccessDeniedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
