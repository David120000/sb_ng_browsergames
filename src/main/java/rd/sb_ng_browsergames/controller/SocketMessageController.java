package rd.sb_ng_browsergames.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import rd.sb_ng_browsergames.model.Message;

@Controller
public class SocketMessageController {

    @Autowired
    private SimpMessageSendingOperations messageOperator;


    @MessageMapping("/chat.sendMessage") // url, when to invoke this method
    @SendTo("/topic/public") // forward the message to a broker
    public Message sendMessage(@Payload Message message) {

        System.out.println("Message from sendMessage: " + message);
        return message;
    }


    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {

        System.out.println("Message from addUser: " + message);
        headerAccessor.getSessionAttributes().put("username", message.getSender()); // add username to websocket session
        return message;
    }


    @MessageMapping("/room/{uuid}")
    public void roomBroker(@DestinationVariable String uuid, @Payload Message message) {
        
        System.out.println("Message for a unique room(" + uuid + "): " + message);
        messageOperator.convertAndSend("/topic/" + uuid, message);
    }
    
}
