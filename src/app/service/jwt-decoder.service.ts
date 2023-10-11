import { Injectable } from '@angular/core';
import { AuthObject } from '../model/auth-object';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtDecoderService {

  constructor() { }


  public getUserNameFromToken(authObject: AuthObject): string {

    let username = "<no name>";

    if(authObject.isJwtPresent() == true) {
      username = new JwtHelperService().decodeToken(authObject.getJwt()).namefromuserdetails;
    }
    
    return username;
  }
}
