package rd.sb_ng_browsergames.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rd.sb_ng_browsergames.model.dto.AuthRequest;
import rd.sb_ng_browsergames.service.AuthenticationService;

@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationService authService;

    
    @PostMapping("/api/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request) throws Exception {

        ResponseEntity<?> response = authService.authenticate(request);

        return response;
    }

    @GetMapping("/api/hello")
    public String hello() {

        return "Hello, User! You passed the test.";
    }
    
}
