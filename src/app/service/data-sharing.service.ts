import { Injectable } from '@angular/core';
import { AuthObject } from '../model/auth-object';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  constructor() { }

  private authObjectSource = new Subject<AuthObject>;
  public setAuthObject(authObject: AuthObject) {
    this.authObjectSource.next(authObject);
  }
  public clearCurrentAuthObject() {
    this.authObjectSource.next(new AuthObject());
  }

  
  private _authObjectObservable$ = this.authObjectSource.asObservable();
  public get authObjectObservable$() {
    return this._authObjectObservable$;
  }


}
