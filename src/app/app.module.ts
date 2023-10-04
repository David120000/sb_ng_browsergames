import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';
import { TictactoeComponent } from './tictactoe/tictactoe.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MinesweeperTimerComponent } from './minesweeper/minesweeper-timer/minesweeper-timer.component';

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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
