package rd.sb_ng_browsergames.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import rd.sb_ng_browsergames.model.Message;
import rd.sb_ng_browsergames.model.MessageType;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessageSendingOperations messageOperator;
    

    @EventListener
    public void listenToWebsocketDisconnect(SessionDisconnectEvent event) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        System.out.println("parsed username in disconnect listener: " + username);

        if(username != null) {

            Message message = new Message();
            message.setType(MessageType.LEAVE);
            message.setSender(username);

            messageOperator.convertAndSend("/topic/public", message);
        }


    }
}
