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

const appRoutes: Routes = [
  { path: 'minesweeper', component: MinesweeperComponent },
  { path: 'tictactoe', component: TictactoeComponent },
  { path: '',   redirectTo: '/', pathMatch: 'full' }, // main page
  { path: '**', component: PageNotFoundComponent }
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
