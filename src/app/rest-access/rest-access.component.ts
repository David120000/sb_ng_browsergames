import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthObject } from './model/auth-object';

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


  public loginUser() {

    let body = JSON.stringify({
      username: "testuser",
      password: "foo"
    });

    let headers = new HttpHeaders()
      .set("Content-Type", "application/json; charset=utf-8");
    
    this.http.post<AuthObject>(this.REST_URL + "/authenticate", body, {headers: headers})
      .subscribe(data => {
        this.authObject = data;
        console.log(this.authObject);
      });
  }

  public getAuthObject(): AuthObject | undefined {
    return this.authObject;
  }




}
