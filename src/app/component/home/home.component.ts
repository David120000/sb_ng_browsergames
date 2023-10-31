import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public getComponentDate(): string {
    return new Date(Date.UTC(2023, 9, 13)).toLocaleDateString();
  }

}
