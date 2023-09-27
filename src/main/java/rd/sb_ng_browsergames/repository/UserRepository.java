package rd.sb_ng_browsergames.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rd.sb_ng_browsergames.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

}
