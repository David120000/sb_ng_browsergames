import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinegameComponent } from './onlinegame.component';

describe('OnlinegameComponent', () => {
  let component: OnlinegameComponent;
  let fixture: ComponentFixture<OnlinegameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlinegameComponent]
    });
    fixture = TestBed.createComponent(OnlinegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
