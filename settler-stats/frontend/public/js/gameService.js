class GameService {
    constructor(BASE_API_URL) {
      this.GAME_API = `${BASE_API_URL}/game`;
    }
  
    createGame(gameData) {
      return _post(this.GAME_API, gameData);
    }
  
    getAllGames() {
      return _get(this.GAME_API, false);
    }
  
    getAllGamesByUser(userId) {
      return _get(`${this.GAME_API}/user/${userId}`, false);
    }
  
    getGamesByCurrentUser() {
      return _get(`${this.GAME_API}/user/me`, false);
    }
  
    updateGame(gameData) {
      return _put(`${this.GAME_API}/${gameData._id}`, gameData);
    }
  
    deleteGame(gameId) {
      return _delete(`${this.GAME_API}/${gameId}`);
    }
  }

  const gameService = new GameService(BASE_API_URL);