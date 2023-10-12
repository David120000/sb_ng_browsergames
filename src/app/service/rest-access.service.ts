import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsercheckRequest } from '../model/usercheck-request';
import { UsercheckResponse } from '../model/usercheck-response';
import { User } from '../model/user';
import { AuthObject } from '../model/auth-object';
import { Observable } from 'rxjs';
import { DataSharingService } from './data-sharing.service';
import { MinesweeperScore } from '../model/minesweeper-score';
import { MinesweeperScorePersistResponse } from '../model/minesweeper-score-persist-response';

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
      .subscribe(response => {

        let userCheckResponse = Object.assign(new UsercheckResponse(), response);

        if(userCheckResponse.isUserAlreadyExists() == true ) {

          this.loginUser(user)
            .subscribe(response => {

              let authObject = Object.assign(new AuthObject(), response);

              this.dataBank.setAuthObject(authObject);
            });

        }
        else {
    
          this.registerUser(user)
            .subscribe(response => {

              let authObject = Object.assign(new AuthObject(), response);

              this.dataBank.setAuthObject(authObject);
            });

        }

      });

  }


  private checkIfAccountAlreadyRegistered(user: User): Observable<UsercheckResponse> {

    const requestBody = new UsercheckRequest(user.getUsername());

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
  
    let response = this.http.post<UsercheckResponse>(
        this.REST_URL + "/checkusername", 
        requestBody, 
        {headers: headers}
      )

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
}
