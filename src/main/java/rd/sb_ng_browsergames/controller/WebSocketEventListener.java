package rd.sb_ng_browsergames.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import rd.sb_ng_browsergames.model.Message;
import rd.sb_ng_browsergames.model.MessageType;
import rd.sb_ng_browsergames.service.TictactoeMatchRegisterService;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessageSendingOperations messageOperator;

    @Autowired
    private TictactoeMatchRegisterService matchRegister;
    

    @EventListener
    public void listenToWebsocketDisconnect(SessionDisconnectEvent event) {

        StompHeaderAccessor eventHeader = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) eventHeader.getSessionAttributes().get("username");

        /* Announce leave to the public channel */
        Message messageToPublicChannel = new Message();
        messageToPublicChannel.setType(MessageType.LEAVE);
        messageToPublicChannel.setSender(username);

        messageOperator.convertAndSend("/topic/public", messageToPublicChannel);
        

        /* Announce leave to user's subscribed game channel on disconnect event. The url will be null if the user had no such subscription. */
        String url = matchRegister.getUnsubscriptionUrl(eventHeader);

        if(url != null) {

            Message messageToSubscribedChannel = new Message();
            messageToSubscribedChannel.setType(MessageType.LEAVE);
            messageToSubscribedChannel.setSender(username);

            messageOperator.convertAndSend(url, messageToSubscribedChannel);
        }

    }


    @EventListener
    public void userJoinsMultiplayerGameListener(SessionSubscribeEvent event) {
        
        StompHeaderAccessor eventHeader = StompHeaderAccessor.wrap(event.getMessage());
        matchRegister.registerUserToMatchUrl(eventHeader);
    }


    @EventListener
    public void userLeavesMultiplayerGameListener(SessionUnsubscribeEvent event) {

        StompHeaderAccessor eventHeader = StompHeaderAccessor.wrap(event.getMessage());
        String url = matchRegister.getUnsubscriptionUrl(eventHeader);

        if(url != null) {

            String username = (String) eventHeader.getSessionAttributes().get("username");

            Message message = new Message();
            message.setType(MessageType.LEAVE);
            message.setSender(username);

            messageOperator.convertAndSend(url, message);
        }

    }
}
