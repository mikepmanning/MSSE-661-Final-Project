const gameApiServiceStub = {
    game: [
        {
            _id: 1,
            start_date: '2025-02-27 23:00:00',
            users: [
                {_id: 1},
                {_id: 2},
                {_id: 3},
                {_id: 4},
            ],
            created_date: '2020-04-14 22:50:32',
        },
    ],
    getGame: () => this.game,
    createGame: (gameData) => {},
    deleteGame: (gameId) => {},
};

const gsTest = new GameService();
const usTest = new UserService();
const gmTest = new GameManager(gsTest, usTest, "game-div");

describe('Game Manager App', () => {
    it('should initialize some HTML', () => {
        spyOn(gmTest, 'initialize');
        gmTest.initialize();

        expect(gmTest.initialize).toHaveBeenCalled();
    });

    let id;
    it('should add a game', async () => {
        const newGame = {
            _id: 1,
            start_date: '2025-02-27 23:00:00',
            users: [
                {_id: 1},
                {_id: 2},
                {_id: 3},
                {_id: 4},
            ],
            created_date: '2020-04-14 22:50:32',
        };

        const addGameServiceSpy = spyOn(gsTest, 'createGame')
        .and.callFake(() => {gmTest.games.push(newGame);
        });

        await gmTest._createGame(newGame);


        expect(addGameServiceSpy).toHaveBeenCalled();
        expect(gmTest.games.length).toBe(1);
        id = newGame._id;
    });

    it('should delete a game', async () => {
        const existingGame = {
            _id: id,
            start_date: '2025-02-27 23:00:00',
            users: [
                {_id: 1},
                {_id: 2},
                {_id: 3},
                {_id: 4},
            ],
            created_date: '2020-04-14 22:50:32',
        };
        const deleteGameServiceSpy = spyOn(gsTest, 'deleteGame')
        .and.callFake(() => {gmTest.games.pop();
        });
        spyOn(window, 'alert');

        await gmTest.deleteGame(existingGame._id);

        expect(deleteGameServiceSpy).toHaveBeenCalled();
        expect(gmTest.games.length).toBe(0);


    });

    
});