package rd.sb_ng_browsergames.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import rd.sb_ng_browsergames.model.User;
import rd.sb_ng_browsergames.repository.UserRepository;

@Service
public class UserDetailsObjProvider implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = null;
        Optional<User> optUser = userRepo.findById(username);

        if(optUser.isPresent() == true) {

            user = optUser.get();
        }
        else {
            throw new UsernameNotFoundException(username + " not found in the database.");
        }

        return user;
    }




}
