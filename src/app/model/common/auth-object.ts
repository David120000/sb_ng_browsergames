export class AuthObject {

    private jwt: string;


    constructor() {
        this.jwt = "";
    }

    
    public getJwt(): string {
        return this.jwt;
    }

    public isJwtPresent(): boolean {
        return (this.jwt.length > 0);
    }
}
