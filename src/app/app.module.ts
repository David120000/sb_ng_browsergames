import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LocalgameComponent } from './component/tictactoe/localgame/localgame.component';
import { OnlinegameComponent } from './component/tictactoe/onlinegame/onlinegame.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faO, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MinesweeperComponent } from './component/minesweeper/minesweeper.component';
import { TictactoeComponent } from './component/tictactoe/tictactoe.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { MinesweeperTimerComponent } from './component/minesweeper/minesweeper-timer/minesweeper-timer.component';
import { MinesweeperGametableComponent } from './component/minesweeper/minesweeper-gametable/minesweeper-gametable.component';
import { UserAuthenticatorComponent } from './component/user-authenticator/user-authenticator.component';
import { MinesweeperResultdialogComponent } from './component/minesweeper/minesweeper-resultdialog/minesweeper-resultdialog.component';
import { HomeComponent } from './component/home/home.component';
import { MinesweeperGameutilsComponent } from './component/minesweeper/minesweeper-gameutils/minesweeper-gameutils.component';
import { MinesweeperLeaderboardComponent } from './component/minesweeper/minesweeper-leaderboard/minesweeper-leaderboard.component';

const appRoutes: Routes = [
  { path: 'minesweeper', component: MinesweeperComponent, data: { route_id: 'Minesweeper'}},
  { path: 'tictactoe', component: TictactoeComponent, data: { route_id: 'Tictactoe'}, children: [
    { path: 'local', outlet: 'game', component: LocalgameComponent},
    { path: 'online/:uuid', outlet: 'game', component: OnlinegameComponent}
  ] },
  { path: 'home', component: HomeComponent, data: { route_id: 'Home'}},
  { path: '',   redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent , data: { route_id: '404'}}
];

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperComponent,
    TictactoeComponent,
    PageNotFoundComponent,
    MinesweeperTimerComponent,
    MinesweeperGametableComponent,
    UserAuthenticatorComponent,
    MinesweeperResultdialogComponent,
    HomeComponent,
    MinesweeperGameutilsComponent,
    MinesweeperLeaderboardComponent,
    LocalgameComponent,
    OnlinegameComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true }
    ),
    HttpClientModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(library: FaIconLibrary) {
    library.addIcons(
      faXmark,
      faO,
      faSpinner
    );
  }
}
