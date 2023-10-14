import { Injectable } from '@angular/core';
import { AuthObject } from '../model/auth-object';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private authObjectDeclared: AuthObject | undefined;
  private authObjectSource = new Subject<AuthObject>;
  private _authObjectObservable$ = this.authObjectSource.asObservable();


  constructor() { }


  public setAuthObject(authObject: AuthObject) {
    this.authObjectDeclared = authObject;
    this.authObjectSource.next(authObject);
  }
  
  public clearCurrentAuthObject() {
    this.authObjectSource.next(new AuthObject());
    this.authObjectDeclared = undefined;
  }

    
  public getDeclaredAuthObject(): AuthObject | undefined {
    return this.authObjectDeclared;
  }
 
  public get authObjectObservable$() {
    return this._authObjectObservable$;
  }



  private errorMsgSource = new Subject<string>;
  public setErrorMsg(message: string) {
    this.errorMsgSource.next(message);
  }
  public clearErrorMsg() {
    this.errorMsgSource.next("");
  }

  private _errorMsgObservable$ = this.errorMsgSource.asObservable();
  public get errorMsgObservable$() {
    return this._errorMsgObservable$;
  }

}
