package rd.sb_ng_browsergames.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;

@Service
public class TictactoeMatchRegisterService {
    
    private Map<String, String> tictactoeMatchUrlsBySessions;


    public TictactoeMatchRegisterService () {
        tictactoeMatchUrlsBySessions = new HashMap<>();
    }


    public void registerUserToMatchUrl(SimpMessageHeaderAccessor eventHeaders) {

        if(eventHeaders.getDestination().equals("/topic/public") == false && eventHeaders.getDestination().startsWith("/topic/") == true) {

           tictactoeMatchUrlsBySessions.put(eventHeaders.getSessionId(), eventHeaders.getDestination());
        }

    }
    

    public String getUnsubscriptionUrl(SimpMessageHeaderAccessor eventHeaders) {

        String destination = tictactoeMatchUrlsBySessions.get(eventHeaders.getSessionId());
        tictactoeMatchUrlsBySessions.remove(eventHeaders.getSessionId());

        return destination;
    }
}
