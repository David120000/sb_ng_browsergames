package rd.sb_ng_browsergames.service;

import java.net.http.HttpHeaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import rd.sb_ng_browsergames.model.dto.AuthRequest;
import rd.sb_ng_browsergames.service.utility.JwtUtil;
import rd.sb_ng_browsergames.service.utility.UserDetailsObjProvider;

@Service
public class AuthenticationService {

    @Autowired
    private UserDetailsObjProvider userObjProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired 
    private JwtUtil jwtUtil;


    public ResponseEntity<String> authenticate(AuthRequest request) throws Exception {

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserDetails user = userObjProvider.loadUserByUsername(request.getUsername());
        String jwt = jwtUtil.generateToken(user);

        return ResponseEntity.ok(jwt);
      }


    
    
}
