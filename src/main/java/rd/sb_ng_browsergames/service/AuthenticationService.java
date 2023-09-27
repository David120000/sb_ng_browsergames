package rd.sb_ng_browsergames.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import rd.sb_ng_browsergames.repository.UserRepository;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepo;


    
    
}
