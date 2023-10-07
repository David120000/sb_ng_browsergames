export class AuthObject {

    private jwt: string;


    constructor() {
        this.jwt = "";
    }

    
    public getJwt(): string {
        return this.jwt;
    }
}
