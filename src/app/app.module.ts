import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';
import { TictactoeComponent } from './tictactoe/tictactoe.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MinesweeperTimerComponent } from './minesweeper/minesweeper-timer/minesweeper-timer.component';
import { MinesweeperGametableComponent } from './minesweeper/minesweeper-gametable/minesweeper-gametable.component';
import { FormsModule } from '@angular/forms';
import { UserAuthenticatorComponent } from './user-authenticator/user-authenticator.component';
import { MinesweeperResultdialogComponent } from './minesweeper/minesweeper-resultdialog/minesweeper-resultdialog.component';
import { HomeComponent } from './home/home.component';
import { MinesweeperGameutilsComponent } from './minesweeper/minesweeper-gameutils/minesweeper-gameutils.component';
import { MinesweeperLeaderboardComponent } from './minesweeper/minesweeper-gameutils/minesweeper-leaderboard/minesweeper-leaderboard.component';

const appRoutes: Routes = [
  { path: 'minesweeper', component: MinesweeperComponent, data: { route_id: 'Minesweeper'}},
  { path: 'tictactoe', component: TictactoeComponent, data: { route_id: 'Tictactoe'}},
  { path: 'home', component: HomeComponent, data: { route_id: 'Home'}},
  { path: '',   redirectTo: '/home', pathMatch: 'full'}, // main page
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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true }
    ),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
