import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of} from 'rxjs';
import { DataSharingService } from './data-sharing.service';
import { User } from 'src/app/model/common/user';
import { UsercheckResponse } from 'src/app/model/common/usercheck-response';
import { AuthObject } from 'src/app/model/common/auth-object';
import { UsercheckRequest } from 'src/app/model/common/usercheck-request';
import { MinesweeperScorePersistResponse } from 'src/app/model/minesweeper/minesweeper-score-persist-response';
import { MinesweeperScore } from 'src/app/model/minesweeper/minesweeper-score';
import { MineswScorePages } from 'src/app/model/minesweeper/minesw-score-pages';
import { TictactoeMatchSubscriptions } from 'src/app/model/tictactoe/tictactoe-match-subscriptions';


@Injectable({
  providedIn: 'root'
})
export class RestAccessService {

  private http: HttpClient;
  private readonly REST_URL: string;
  private dataBank: DataSharingService;


  constructor(http: HttpClient, dataBank: DataSharingService) {
    this.http = http;
    this.REST_URL = "http://localhost:8080/api";
    this.dataBank = dataBank;
   }


  public authenticateUser(user: User) {

    this.checkIfAccountAlreadyRegistered(user)
      .pipe(catchError(error => 
        this.authenticationErrorHandler(error)
      ))
      .subscribe(response => {

        let userCheckResponse = Object.assign(new UsercheckResponse(), response);

        if(userCheckResponse.isUserAlreadyExists() == true ) {

          this.loginUser(user)
            .pipe(catchError(error => 
              this.authenticationErrorHandler(error)
            ))
            .subscribe(response => {

              let authObject = Object.assign(new AuthObject(), response);

              this.dataBank.setAuthObject(authObject);
            });
        }
        else {

          this.registerUser(user)
            .pipe(catchError(error => 
              this.authenticationErrorHandler(error)
            ))
            .subscribe(response => {

              let authObject = Object.assign(new AuthObject(), response);

              this.dataBank.setAuthObject(authObject);
            });
        }

      })

  }


  private checkIfAccountAlreadyRegistered(user: User): Observable<UsercheckResponse> {

    const requestBody = new UsercheckRequest(user.getUsername());

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
  
    let response = this.http.post<UsercheckResponse>(
        this.REST_URL + "/checkusername", 
        requestBody, 
        {headers: headers}
      );

    return response;
  }


  private loginUser(user: User): Observable<AuthObject> {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    
    let authObject = this.http.post<AuthObject>(this.REST_URL + "/authenticate", user, {headers: headers});

    return authObject;
  }


  private registerUser(user: User): Observable<AuthObject> {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
  
    let authObject = this.http.post<AuthObject>(this.REST_URL + "/register", user, {headers: headers})

    return authObject;
  }


  public postNewMinesweeperScore(score: MinesweeperScore, jwt: string): Observable<MinesweeperScorePersistResponse> {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8")
      .set("Authorization", "Bearer " + jwt);

    let response = this.http.post<MinesweeperScorePersistResponse>(this.REST_URL + "/minesweeper/new", score, {headers: headers});
    
    return response;
  }


  public getTopMinesweeperScores(jwt: string, page: number): Observable<MineswScorePages> {
    
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8")
      .set("Authorization", "Bearer " + jwt);

    let parametersOption = new HttpParams()
      .set("page", page);

    let response = this.http.get<MineswScorePages>(this.REST_URL + "/minesweeper/topscores", {headers: headers, params: parametersOption});

    return response;
  }


  public getUserTopScores(jwt: string, userName: string, order: string, page: number): Observable<MineswScorePages> {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8")
      .set("Authorization", "Bearer " + jwt);

    let parametersOption = new HttpParams()
      .set("page", page)
      .set("username", userName)
      .set("order", order);

    let response = this.http.get<MineswScorePages>(this.REST_URL + "/minesweeper/userscore/sortedbyscores", {headers: headers, params: parametersOption});

    return response;
  }


  public getSubscribedUsersByUuid(jwt: string, uuid: string): Observable<TictactoeMatchSubscriptions> {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8")
      .set("Authorization", "Bearer " + jwt);


    let response = this.http.get<TictactoeMatchSubscriptions>(this.REST_URL + "/tictactoe/subscriptions/" + uuid, {headers: headers});

    return response;
  }


  private authenticationErrorHandler(error: HttpErrorResponse) {

    let message = "";

    if (error.status == 0) {
      message = "An error occured: client-side or network error";
      console.error(message);
    } 
    else {
      message = "An error occured: " + error.error;
      console.error(message);
    }

    this.dataBank.setErrorMsg(message);

    return of({jwt: ""});
  }
  
}
