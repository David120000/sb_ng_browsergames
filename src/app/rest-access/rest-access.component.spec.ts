import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestAccessComponent } from './rest-access.component';

describe('RestAccessComponent', () => {
  let component: RestAccessComponent;
  let fixture: ComponentFixture<RestAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestAccessComponent]
    });
    fixture = TestBed.createComponent(RestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
