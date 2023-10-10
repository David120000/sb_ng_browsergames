package rd.sb_ng_browsergames.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import rd.sb_ng_browsergames.model.MinesweeperScore;
import rd.sb_ng_browsergames.service.MinesweeperService;

@RestController
public class MinesweeperScoreController {
    
    @Autowired
    private MinesweeperService minesweeperService;


    @PostMapping("/api/minesweeper/new")
    public ResponseEntity<?> persistNewScore(@RequestBody MinesweeperScore newScore) {

        return minesweeperService.persistNewScore(newScore);
    }


    @GetMapping("/api/minesweeper/topscores")
    public Page<MinesweeperScore> getTopScores10PerPage(@RequestParam(name="page") int pageNumber) {
        
        return minesweeperService.getTopScores10PerPage(pageNumber);
    }


    @GetMapping("/api/minesweeper/userscore/history")
    public Page<MinesweeperScore> getUserScoreHistory10PerPage(
            @RequestParam(name="username") String userName,
            @RequestParam(name="page") int pageNumber
    ) {

        return minesweeperService.getScoreHistoryByUserName10PerPage(userName, pageNumber);
    }


    @GetMapping("/api/minesweeper/userscore/sortedbyscores")
    public Page<MinesweeperScore> getUserScoresSorted10PerPage(
            @RequestParam(name="username") String userName,
            @RequestParam(name="order") String listOrder,
            @RequestParam(name="page") int pageNumber
    ) {

        return minesweeperService.getTopScoresByUserName10PerPage(userName, listOrder, pageNumber);
    }


    @GetMapping("/api/minesweeper/userscore/byid")
    public MinesweeperScore getScoreById(@RequestParam(name="id") long id) {
        
        return minesweeperService.getScoreById(id);
    }

}
