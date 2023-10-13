import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'sb_ng_browsergames';

  private contexts: ChildrenOutletContexts;
  private elementRef: ElementRef;
  private renderer: Renderer2;


  constructor(contexts: ChildrenOutletContexts, elementRef: ElementRef, renderer: Renderer2) {
    this.contexts = contexts;
    this.elementRef = elementRef;
    this.renderer = renderer;
  }


  public ngAfterViewInit() {
    setTimeout(() => this.appInitAnimation());
  }


  public getCurrentRouteId() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['route_id'];
  }


  private appInitAnimation() {

    let bgDuck = this.elementRef.nativeElement.querySelector('#Capa_1_1');
    let bgCube = this.elementRef.nativeElement.querySelector('#Capa_1_2');
    let bgLego = this.elementRef.nativeElement.querySelector('#Capa_1_3');
    let navCardContainer = this.elementRef.nativeElement.querySelector('#card-container');
    let routerOutletDiv = this.elementRef.nativeElement.querySelector('#routerOutlet');

    this.renderer.setStyle(bgDuck, "bottom", "-5%");
    this.renderer.setStyle(bgDuck, "right", "80%");
    this.renderer.setStyle(bgDuck, "opacity", "0");

    this.renderer.setStyle(bgCube, "bottom", "70%");
    this.renderer.setStyle(bgCube, "right", "105%");
    this.renderer.setStyle(bgCube, "opacity", "0");

    this.renderer.setStyle(bgLego, "bottom", "30%");
    this.renderer.setStyle(bgLego, "left", "105%");
    this.renderer.setStyle(bgLego, "opacity", "0");

    this.renderer.setStyle(navCardContainer, "opacity", "1");

    this.renderer.setStyle(routerOutletDiv, "opacity", "1");
  }

}
