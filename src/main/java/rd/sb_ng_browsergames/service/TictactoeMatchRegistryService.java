package rd.sb_ng_browsergames.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

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

           tictactoeMatchUrlsBySessions.put(eventHeaders.getSessionId(), eventHeaders.getDestination());
        }
    }
    

    public String getMatchUrlByUserSession(SimpMessageHeaderAccessor eventHeaders) {

        String destination = tictactoeMatchUrlsBySessions.get(eventHeaders.getSessionId());
        tictactoeMatchUrlsBySessions.remove(eventHeaders.getSessionId());

        return destination;
    }


    public TictactoeMatchSubscriptions getSubscribedUsersByUuid(String uuid) {

        List<String> subscribedUsers = new ArrayList<>();

        userRegistry.getUsers().stream()
            .filter(user -> user.getSessions().toString().contains("/topic/" + uuid))
                .toList()
                    .forEach(user -> subscribedUsers.add(user.getName()));


        // userRegistry.getUsers().forEach(user -> {
        //     user.getSessions().forEach(session -> {
        //         session.getSubscriptions().forEach(subscription -> {
        //             if(subscription.toString().contains("/topic/" + uuid)) {
        //                 subscribedUsers.add(user.getName());
        //             }
        //         });
        //     });
        // });

        TictactoeMatchSubscriptions subscriptionsByUuid = new TictactoeMatchSubscriptions(uuid, subscribedUsers);

        return subscriptionsByUuid;
    }
}
