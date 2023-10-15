import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ChildrenOutletContexts, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'sb_ng_browsergames';

  private contexts: ChildrenOutletContexts;
  private elementRef: ElementRef;
  private renderer: Renderer2;
  private router: Router;

  private cachedRoute: string;


  constructor(contexts: ChildrenOutletContexts, elementRef: ElementRef, renderer: Renderer2, router: Router) {
   
    this.contexts = contexts;
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.router = router;
    this.cachedRoute = "";
  }


  public ngOnInit(): void {
   
    this.router.events.subscribe(data => {
      
      if(data instanceof RoutesRecognized) {
        this.changeViewByRoute(data);
      }

    });
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


  private changeViewByRoute(route: RoutesRecognized) {

    let currentRoute = route.state.root.firstChild?.data['route_id'];

    if(currentRoute == "Minesweeper" || currentRoute == "Tictactoe") {
      if(this.cachedRoute != "Minesweeper" && this.cachedRoute != "Tictactoe") {

        this.minimizeGameMenu();
        this.cachedRoute = currentRoute;
      }
    }

    if(currentRoute != "Minesweeper" && currentRoute != "Tictactoe") {
      if(this.cachedRoute == "Minesweeper" || this.cachedRoute == "Tictactoe") {

        this.maximizeGameMenu();
        this.cachedRoute = currentRoute;
      }
    }
  }


  private minimizeGameMenu() {

    let cardcontainer = this.elementRef.nativeElement.querySelector("#card-container");
    let tictactoesvg = this.elementRef.nativeElement.querySelector("#tictactoesvg");
    let bombsvg = this.elementRef.nativeElement.querySelector("#bombsvg");
    let tictactoecard = this.elementRef.nativeElement.querySelector("#tictactoecard");
    let minesweepercard = this.elementRef.nativeElement.querySelector("#minesweepercard");

    this.renderer.setStyle(tictactoesvg, "width", "20px");
    this.renderer.setStyle(tictactoesvg, "height", "20px");

    this.renderer.setStyle(bombsvg, "width", "20px");
    this.renderer.setStyle(bombsvg, "height", "20px");

    this.renderer.setStyle(cardcontainer, "margin-top", "6px");
    this.renderer.setStyle(cardcontainer, "margin-bottom", "0px");

    this.renderer.setStyle(tictactoecard, "height", "20px");
    this.renderer.setStyle(tictactoecard, "padding", "6px");
    this.renderer.setStyle(tictactoecard, "border-radius", "5px");

    this.renderer.setStyle(minesweepercard, "height", "20px");
    this.renderer.setStyle(minesweepercard, "padding", "6px");
    this.renderer.setStyle(minesweepercard, "border-radius", "5px");
  }


  private maximizeGameMenu() {

    let cardcontainer = this.elementRef.nativeElement.querySelector("#card-container");
    let tictactoesvg = this.elementRef.nativeElement.querySelector("#tictactoesvg");
    let bombsvg = this.elementRef.nativeElement.querySelector("#bombsvg");
    let tictactoecard = this.elementRef.nativeElement.querySelector("#tictactoecard");
    let minesweepercard = this.elementRef.nativeElement.querySelector("#minesweepercard");

    this.renderer.setStyle(tictactoesvg, "width", "50px");
    this.renderer.setStyle(tictactoesvg, "height", "50px");

    this.renderer.setStyle(bombsvg, "width", "50px");
    this.renderer.setStyle(bombsvg, "height", "50px");

    this.renderer.setStyle(cardcontainer, "margin-top", "26px");
    this.renderer.setStyle(cardcontainer, "margin-bottom", "30px");

    this.renderer.setStyle(tictactoecard, "height", "78px");
    this.renderer.setStyle(tictactoecard, "padding", "16px");
    this.renderer.setStyle(tictactoecard, "border-radius", "15px");

    this.renderer.setStyle(minesweepercard, "height", "78px");
    this.renderer.setStyle(minesweepercard, "padding", "16px");
    this.renderer.setStyle(minesweepercard, "border-radius", "15px");
  }

}
