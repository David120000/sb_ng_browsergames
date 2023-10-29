import { SubscribedUser } from "./subscribed-user";

export class TictactoeMatchSubscriptions {

    private uuid: string;
    private subscribedUsers: Array<SubscribedUser>;


    constructor() {
        this.uuid = "";
        this.subscribedUsers = [];
    }


    public getUuid(): string {
        return this.uuid;
    }

    public getSubscribedUsers(): Array<SubscribedUser> {
        return this.subscribedUsers;
    }
}
