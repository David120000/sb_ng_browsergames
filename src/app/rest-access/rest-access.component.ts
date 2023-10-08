import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthObject } from './model/auth-object';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './model/user';
import { UsercheckResponse } from './model/usercheck-response';
import { UsercheckRequest } from './model/usercheck-request';

@Component({
  selector: 'app-rest-access',
  templateUrl: './rest-access.component.html',
  styleUrls: ['./rest-access.component.css']
})
export class RestAccessComponent {

  private http: HttpClient;
  private readonly REST_URL: string;

  private authObject: AuthObject | undefined;


  constructor(http: HttpClient) {
    
    this.http = http;
    this.REST_URL = "http://localhost:8080/api";
  }


  public nameInputHandler(username: string) {

    let user = new User(username, "foo");

    if(this.checkIfAccountAlreadyRegistered(user).isUserAlreadyExists() == true ) {
      
      this.loginUser(user)
    }
    else {

      this.registerUser(user);
    }
  }


  private checkIfAccountAlreadyRegistered(user: User): UsercheckResponse {

    const requestBody = new UsercheckRequest(user.getUsername());
    let response = new UsercheckResponse();

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
  
    this.http.post<UsercheckResponse>(this.REST_URL + "/checkusername", requestBody, {headers: headers})
      .subscribe(data => {
        Object.assign(response, data);
      });

    return response;
  }


  private loginUser(user: User) {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    
    this.http.post<AuthObject>(this.REST_URL + "/authenticate", user, {headers: headers})
      .subscribe(data => {
        this.authObject = Object.assign(new AuthObject(), data);
      });
  }


  private registerUser(user: User) {

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
  
    this.http.post<AuthObject>(this.REST_URL + "/register", user, {headers: headers})
      .subscribe(data => {
        this.authObject = Object.assign(new AuthObject(), data);
      });
  }


  public logoutUser() {
    this.authObject = undefined;
  }

  public onMouseEnter(hoverButton: HTMLElement) {
    hoverButton.style.opacity = "1";
  }

  public onMouseLeave(hoverButton: HTMLElement) {
    hoverButton.style.opacity = "0";
  }

  public getAuthObject(): AuthObject | undefined {
    return this.authObject;
  }

  public getPlayerName(): string | undefined {
    
    let playerName = undefined;

    if(this.authObject != undefined) {

      playerName = new JwtHelperService().decodeToken(this.authObject.getJwt()).namefromuserdetails;
    }

    return playerName;
  }




}
