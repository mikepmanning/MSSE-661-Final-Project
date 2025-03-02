
const createGameModal = document.getElementById('createGameModal');
const newGameButton = document.getElementById('createGame');

class GameManager {
    constructor(gameService, userService, gameSectionId) {
        this.gameService = gameService;
        this.userService = userService;
        this.gameSection = document.getElementById(gameSectionId);
        this.games = [];
        this.users = [];
    }

    async fetchGames() {
        try {
           const res = await this.gameService.getGamesByCurrentUser();
           const response = await res.json();
           if (res.ok) {
            this.games = response;
            // Sort games by started_date in descending order
            this.games.sort((a, b) => new Date(b.started_date) - new Date(a.started_date));
           }
        } catch (error) {
            console.error('Error fetching games:', error);
            this.games = [];
        }
    }

    async fetchUsers() {
        try {
           const res = await this.userService.getAllUsers();
           const response = await res.json();
           if (res.ok) {
            this.users = response;
           }
        } catch (error) {
            console.error('Error fetching games:', error);
            this.users = [];
        }
    }

    populateUserSelect() {
        const userSelect = document.getElementById('users');
        userSelect.innerHTML = '';
    
        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user._id;
            option.textContent = `${user.firstName} ${user.lastName}`;
            userSelect.appendChild(option);
        });
    }

    displayGames() {
        this.gameSection.innerHTML = '';

        const createGameButton = document.createElement('button');
        createGameButton.textContent = 'Create Game';
        createGameButton.id = 'create-game-btn';
        createGameButton.onclick = function () {
            createGameModal.style.display = 'block';
        }
        this.gameSection.appendChild(createGameButton);

        if (this.games.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No games found.';
            this.gameSection.appendChild(message);
            return;
        }
    
        const table = document.createElement('table');
        const headerRow = table.insertRow();
        headerRow.insertCell().textContent = 'Game Date';
        headerRow.insertCell().textContent = 'Players';
        headerRow.insertCell().textContent = 'Actions';
    
        this.games.forEach(game => {
            const row = table.insertRow();
            const formattedStartDate = new Date(game.started_date).toLocaleDateString('en-US', {
                timeZone: 'UTC' // Ensure UTC timezone
            });
            row.insertCell().textContent = formattedStartDate;
            const playersCell = row.insertCell();
    
            const playerList = document.createElement('ul');
            game.users.forEach(user => {
                const playerItem = document.createElement('li');
                playerItem.textContent = `${user.firstName} ${user.lastName}`;
                playerList.appendChild(playerItem);
            });
    
            playersCell.appendChild(playerList);

            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('data-game-id', game._id); 
            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this game?')) {
                    this.deleteGame(game._id);
                }
            });
            actionsCell.appendChild(deleteButton);
        });
    
        this.gameSection.appendChild(table);
    }

    async initialize() {
        await this.fetchGames();
        await this.fetchUsers();
        this.displayGames();
        this.populateUserSelect();
    }

    async createNewGame(event) {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const userSelect = document.getElementById('users');
        const selectedUserIds = Array.from(userSelect.selectedOptions).map(option => option.value);
    
        try {
            // Ensure at least one user is selected
            if (selectedUserIds.length === 0) {
                console.error("Please select at least one player.");
                alert("You must select at least one player");
                return;
            }
    
            // Ensure no more than 4 users are selected
            if (selectedUserIds.length > 4) {
                console.error("You can select a maximum of 4 players.");
                alert("You cannot select more than 4 players.");
                return;
            }
    
            const gameData = {
                started_date: startDate,
                users: selectedUserIds
            };
    
            const response = await this.gameService.createGame(gameData);
            if (response.ok) {
                this.initialize();
                createGameModal.style.display = 'none';
            } else {
                console.error("Failed to create game:", response.status);
                alert("Error creating game, please try again later.");
            }
        } catch (error) {
            console.error('Error creating game:', error);
            alert("Error creating game, please try again later.");
        }



    }

    async deleteGame(gameId) {
        try {
            const res = await this.gameService.deleteGame(gameId);
            if (res.ok) {
                this.initialize();
             }
         } catch (error) {
             console.error('Error deleting game:', error);
             alert("Error deleting game, please try later");
         } 
    }
}

const gameManager = new GameManager(gameService, userService, "game-div");