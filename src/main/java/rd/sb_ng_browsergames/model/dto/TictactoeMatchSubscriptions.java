package rd.sb_ng_browsergames.model.dto;

import java.util.List;

public class TictactoeMatchSubscriptions {

    private String uuid;
    private List<String> subscribedUsers;


    public TictactoeMatchSubscriptions(String uuid, List<String> subscribedUsers) {
        this.uuid = uuid;
        this.subscribedUsers = subscribedUsers;
    }


    public String getUuid() {
        return uuid;
    }
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
    public List<String> getSubscribedUsers() {
        return subscribedUsers;
    }
    public void setSubscribedUsers(List<String> subscribedUsers) {
        this.subscribedUsers = subscribedUsers;
    }

    @Override
    public String toString() {
        return "TictactoeMatchSubscriptions [uuid=" + uuid + ", subscribedUsers=" + subscribedUsers + "]";
    }
    
}
