import { MinesweeperGame } from './minesweeper-game';

describe('MinesweeperGame', () => {
  it('should create an instance', () => {
    expect(new MinesweeperGame(1)).toBeTruthy();
  });
});
