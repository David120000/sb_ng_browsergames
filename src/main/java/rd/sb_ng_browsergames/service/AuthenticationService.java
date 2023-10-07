package rd.sb_ng_browsergames.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import rd.sb_ng_browsergames.model.User;
import rd.sb_ng_browsergames.model.dto.AuthRequest;
import rd.sb_ng_browsergames.model.dto.AuthResponse;
import rd.sb_ng_browsergames.model.dto.UsercheckRequest;
import rd.sb_ng_browsergames.model.dto.UsercheckResponse;
import rd.sb_ng_browsergames.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public ResponseEntity<AuthResponse> authenticate(AuthRequest request) throws Exception {

      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

      UserDetails user = userObjProvider.loadUserByUsername(request.getUsername());
      String jwt = jwtUtil.generateToken(user);

      return ResponseEntity.ok(new AuthResponse(jwt));
    }


    public ResponseEntity<UsercheckResponse> checkIfUsernameExists(UsercheckRequest request) {

      UsercheckResponse response = new UsercheckResponse();
      response.setUserAlreadyExists( userRepository.existsById(request.getUsername()) );

      return ResponseEntity.ok(response);
    }


    public ResponseEntity<AuthResponse> registerNewUser(AuthRequest newUserRequest) {

      if(newUserRequest.getUsername().length() > 14 || newUserRequest.getUsername().length() < 3) {
        throw new IllegalArgumentException("Player name should be between 3 and 14 characters long.");
      }

      User newUser = new User();
      newUser.setUserName(newUserRequest.getUsername());
      newUser.setPassword(passwordEncoder.encode(newUserRequest.getPassword()));
      newUser.setAuthority("USER");
      newUser.setEnabled(true);

      UserDetails persistedUser = userRepository.save(newUser);

      String jwt = jwtUtil.generateToken(persistedUser);

      return ResponseEntity.ok(new AuthResponse(jwt));
    }
    
    
}
