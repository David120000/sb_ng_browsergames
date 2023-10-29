package rd.sb_ng_browsergames.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import rd.sb_ng_browsergames.model.dto.TictactoeMatchSubscriptions;
import rd.sb_ng_browsergames.service.TictactoeMatchRegistryService;

@CrossOrigin("http://localhost:4200")
@RestController
public class GameSubscriptionsController {

    @Autowired
    private TictactoeMatchRegistryService registryService;


    @GetMapping("/api/tictactoe/subscriptions/{uuid}")
    public TictactoeMatchSubscriptions getSubscribedUsersByUuid(@PathVariable("uuid") String uuid) {
        
        TictactoeMatchSubscriptions subscriptionsByUuid = registryService.getSubscribedUsersByUuid(uuid);

        return subscriptionsByUuid;
    }

}
