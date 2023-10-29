package rd.sb_ng_browsergames.model.dto;

public class SubscribedUser {

    private String userName;
    private String sessionId;

    
    public SubscribedUser(String userName, String sessionId) {
        this.userName = userName;
        this.sessionId = sessionId;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    @Override
    public String toString() {
        return "SubscribedUser [userName=" + userName + ", sessionId=" + sessionId + "]";
    }

}
