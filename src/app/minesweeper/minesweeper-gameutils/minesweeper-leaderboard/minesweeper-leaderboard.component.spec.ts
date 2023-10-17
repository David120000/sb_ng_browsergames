import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperLeaderboardComponent } from './minesweeper-leaderboard.component';

describe('MinesweeperLeaderboardComponent', () => {
  let component: MinesweeperLeaderboardComponent;
  let fixture: ComponentFixture<MinesweeperLeaderboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinesweeperLeaderboardComponent]
    });
    fixture = TestBed.createComponent(MinesweeperLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
