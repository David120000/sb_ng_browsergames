import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperGametableComponent } from './minesweeper-gametable.component';

describe('MinesweeperGametableComponent', () => {
  let component: MinesweeperGametableComponent;
  let fixture: ComponentFixture<MinesweeperGametableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinesweeperGametableComponent]
    });
    fixture = TestBed.createComponent(MinesweeperGametableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
