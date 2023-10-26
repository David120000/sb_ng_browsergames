export class UsercheckResponse {

    private userAlreadyExists: boolean | undefined;

    
    public isUserAlreadyExists(): boolean | undefined {
        return this.userAlreadyExists;
    }

    public setUserAlreadyExists(value: boolean) {
        this.userAlreadyExists = value;
    }


}