import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperTimerComponent } from './minesweeper-timer.component';

describe('MinesweeperTimerComponent', () => {
  let component: MinesweeperTimerComponent;
  let fixture: ComponentFixture<MinesweeperTimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinesweeperTimerComponent]
    });
    fixture = TestBed.createComponent(MinesweeperTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
