package rd.sb_ng_browsergames.model.dto;

public class MinesweeperScorePersistResponse {

    private boolean successfullyPersisted;
    private long id;


    public boolean isSuccessfullyPersisted() {
        return successfullyPersisted;
    }
    public void setSuccessfullyPersisted(boolean successfullyPersisted) {
        this.successfullyPersisted = successfullyPersisted;
    }
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    
}
