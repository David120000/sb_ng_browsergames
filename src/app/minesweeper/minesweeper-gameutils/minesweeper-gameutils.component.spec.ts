import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperGameutilsComponent } from './minesweeper-gameutils.component';

describe('MinesweeperGameutilsComponent', () => {
  let component: MinesweeperGameutilsComponent;
  let fixture: ComponentFixture<MinesweeperGameutilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinesweeperGameutilsComponent]
    });
    fixture = TestBed.createComponent(MinesweeperGameutilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
