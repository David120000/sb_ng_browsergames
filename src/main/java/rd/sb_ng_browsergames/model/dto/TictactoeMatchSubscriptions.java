package rd.sb_ng_browsergames.model.dto;

import java.util.List;

public class TictactoeMatchSubscriptions {

    private String uuid;
    private List<SubscribedUser> subscribedUsers;


    public TictactoeMatchSubscriptions(String uuid, List<SubscribedUser> subscribedUsers) {
        this.uuid = uuid;
        this.subscribedUsers = subscribedUsers;
    }


    public String getUuid() {
        return uuid;
    }
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
    public List<SubscribedUser> getSubscribedUsers() {
        return subscribedUsers;
    }
    public void setSubscribedUsers(List<SubscribedUser> subscribedUsers) {
        this.subscribedUsers = subscribedUsers;
    }

    @Override
    public String toString() {
        return "TictactoeMatchSubscriptions [uuid=" + uuid + ", subscribedUsers=" + subscribedUsers + "]";
    }
    
}
