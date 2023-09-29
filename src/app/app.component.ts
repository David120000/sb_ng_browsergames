import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sb_ng_browsergames';

  private _jwt: string | undefined;
  
  
  public get jwt(): string | undefined {
    return this._jwt;
  }
  
  public set jwt(value: string | undefined) {
    this._jwt = value;
  }


}
