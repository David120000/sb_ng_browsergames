import { MessageType } from "./message-type";

export class Message {

    sender: string;
    content: string;
    type: MessageType;

    constructor() { 
        this.sender = '';
        this.content = '';
        this.type = MessageType.CHAT;
    }
}
