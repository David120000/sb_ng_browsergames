import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthObject } from 'src/app/model/common/auth-object';

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
