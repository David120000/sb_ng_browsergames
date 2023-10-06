package rd.sb_ng_browsergames.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import rd.sb_ng_browsergames.model.dto.AuthRequest;
import rd.sb_ng_browsergames.model.dto.UsercheckRequest;
import rd.sb_ng_browsergames.service.AuthenticationService;

@CrossOrigin("http://localhost:4200")
@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationService authService;


    @PostMapping("/api/checkusername")
    public ResponseEntity<?> checkIfUsernameExists(@RequestBody UsercheckRequest request) {
        
        ResponseEntity<?> response = authService.checkIfUsernameExists(request);
        
        return response;
    }

    
    @PostMapping("/api/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request) throws Exception {

        ResponseEntity<?> response = authService.authenticate(request);

        return response;
    }


    @PostMapping("/api/register")
    public ResponseEntity<?> registerNewUser(@RequestBody AuthRequest request) {

        ResponseEntity<?> response = authService.registerNewUser(request);

        return response;
    }


    @GetMapping("/api/hello")
    public String hello() {

        return "Hello, User! You passed the test.";
    }
    
}
