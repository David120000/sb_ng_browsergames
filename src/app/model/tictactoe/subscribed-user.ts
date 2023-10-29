export class SubscribedUser {

    userName: string;
    sessionId: string;

    constructor() {
        this.userName = "";
        this.sessionId = "";
    }

    public toString(): string {
        return ("SubscribedUser [userName=" + this.userName + ", sessionId=" + this.sessionId + "]");
    }
}
