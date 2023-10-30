package rd.sb_ng_browsergames.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import rd.sb_ng_browsergames.model.dto.SubscribedUser;
import rd.sb_ng_browsergames.model.dto.TictactoeMatchSubscriptions;

@Service
public class TictactoeMatchRegistryService {

    @Autowired
    private SimpUserRegistry userRegistry;
    
    private Map<String, String> tictactoeMatchUrlsBySessions;


    public TictactoeMatchRegistryService () {
        tictactoeMatchUrlsBySessions = new HashMap<>();
    }


    public void registerMatchUrlByUserSession(SimpMessageHeaderAccessor eventHeaders) {

        if(eventHeaders.getDestination().equals("/topic/public") == false && eventHeaders.getDestination().startsWith("/topic/") == true) {
            System.out.println("New match registered: " + eventHeaders.getSessionId() + ", user: " + eventHeaders.getUser());
            tictactoeMatchUrlsBySessions.put(eventHeaders.getSessionId(), eventHeaders.getDestination());
        }
    }
    

    public String getMatchUrlByUserSession(SimpMessageHeaderAccessor eventHeaders) {

        String destination = tictactoeMatchUrlsBySessions.get(eventHeaders.getSessionId());
        tictactoeMatchUrlsBySessions.remove(eventHeaders.getSessionId());

        return destination;
    }


    public TictactoeMatchSubscriptions getSubscribedUsersByUuid(String uuid) {

        List<SubscribedUser> subscribedUsers = new ArrayList<>();

         userRegistry.getUsers().stream()
            .filter(user -> user.getSessions().toString().contains("/topic/" + uuid))
                .toList()
                    .forEach(user -> user.getSessions()
                        .forEach(session -> subscribedUsers.add(
                            new SubscribedUser( user.getName(), session.getId()) )));

        TictactoeMatchSubscriptions subscriptionsByUuid = new TictactoeMatchSubscriptions(uuid, subscribedUsers);

        return subscriptionsByUuid;
    }
}
