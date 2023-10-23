import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-onlinegame',
  templateUrl: './onlinegame.component.html',
  styleUrls: ['./onlinegame.component.css']
})
export class OnlinegameComponent {

  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }


  public createGame() {
    const uuid = uuidv4();
    this.router.navigate(['tictactoe', { outlets: { 'game': ['online', uuid]} }]);
     
  }

}
