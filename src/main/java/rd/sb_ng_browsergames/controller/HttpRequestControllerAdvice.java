package rd.sb_ng_browsergames.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class HttpRequestControllerAdvice {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleConflict(RuntimeException ex) {
       
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
    }
    
}
