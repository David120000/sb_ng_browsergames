import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sb_ng_browsergames';

  private contexts: ChildrenOutletContexts;


  constructor(contexts: ChildrenOutletContexts) {
    this.contexts = contexts;
  }


  public getCurrentRouteId() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['route_id'];
  }

}
