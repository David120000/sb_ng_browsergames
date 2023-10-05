export class AuthObject {

    private jwt: string;


    constructor(jwt: string) {
        this.jwt = jwt;
    }

    
    public getJwt(): string {
        return this.jwt;
    }
}
