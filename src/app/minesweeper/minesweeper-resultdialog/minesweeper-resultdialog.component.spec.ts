import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperResultdialogComponent } from './minesweeper-resultdialog.component';

describe('MinesweeperResultdialogComponent', () => {
  let component: MinesweeperResultdialogComponent;
  let fixture: ComponentFixture<MinesweeperResultdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinesweeperResultdialogComponent]
    });
    fixture = TestBed.createComponent(MinesweeperResultdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
