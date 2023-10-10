package rd.sb_ng_browsergames.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rd.sb_ng_browsergames.model.MinesweeperScore;

@Repository
public interface MinesweeperScoreRepository extends JpaRepository<MinesweeperScore, Long> {
    
    Page<MinesweeperScore> findAllByOrderByScoreDesc(Pageable pageable);

    Page<MinesweeperScore> findByUserNameOrderByDateDesc(String userName, Pageable pageable);

    Page<MinesweeperScore> findByUserNameOrderByScoreDesc(String userName, Pageable pageable);

    Page<MinesweeperScore> findByUserNameOrderByScoreAsc(String userName, Pageable pageable);
}
