package rd.sb_ng_browsergames.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import rd.sb_ng_browsergames.model.MinesweeperScore;
import rd.sb_ng_browsergames.repository.MinesweeperScoreRepository;

@Service
public class MinesweeperService {
    
    @Autowired
    private MinesweeperScoreRepository minesweeperScoreRepository;


    public Page<MinesweeperScore> getTopScores10PerPage(int pageNumber) {

        Pageable pageable = PageRequest.of(pageNumber, 10);
        Page<MinesweeperScore> resultList = minesweeperScoreRepository.findAllByOrderByScoreDesc(pageable);

        return resultList;
    }


    public Page<MinesweeperScore> getScoreHistoryByUserName10PerPage(String userName, int pageNumber) {
        
        Pageable pageable = PageRequest.of(pageNumber, 10);
        Page<MinesweeperScore> resultList = minesweeperScoreRepository.findByUserNameOrderByDateDesc(userName, pageable);

        return resultList;
    }


    public Page<MinesweeperScore> getTopScoresByUserName10PerPage(String userName, String listOrder, int pageNumber) {

        Page<MinesweeperScore> resultList = null;

        if(listOrder.equals("desc")) {

            Pageable pageable = PageRequest.of(pageNumber, 10);
            resultList = minesweeperScoreRepository.findByUserNameOrderByScoreDesc(userName, pageable);
        }
        else if(listOrder.equals("asc")) {

            Pageable pageable = PageRequest.of(pageNumber, 10);
            resultList = minesweeperScoreRepository.findByUserNameOrderByScoreAsc(userName, pageable);
        }
        else {
            throw new IllegalArgumentException("Invalid sorting parameter. It should \"desc\" for descending and \"asc\" for ascending list orders.");
        }


        return resultList;
    }


    public MinesweeperScore getScoreById(long id) {

        MinesweeperScore result = null;

        Optional<MinesweeperScore> optionalScore = minesweeperScoreRepository.findById(id);

        if(optionalScore.isPresent()) {
            result = optionalScore.get();
        }

        return result;
    }

}
