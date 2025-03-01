import Game from '../model/game.js';

export const createGame = async function(req, res) {
    console.log("Entering createGame");
    try {
        const newGame = new Game(req.body);
        const savedGame = await newGame.save()
        await savedGame.populate({
            path: 'users',
            select: '-password',
        });
        res.status(201).json(savedGame);
    } catch (err) {
        console.error("Error creating game:", err);
        res.status(500).json({ error: 'Failed to create game' });
    }
}

export const getAllGamesByUser = async function(req, res) {
    try {
        const userId = req.params.userId; 
        const games = await Game.find({ users: userId }).populate({
            path: 'users',
            select: '-password',
        }); 
        res.status(200).json(games);
    } catch (err) {
        console.error("Error fetching games by user:", err);
        res.status(500).json({ error: 'Failed to fetch games by user' });
    }
}

export const getAllGames = async function(req, res) {
    try {
        const games = await Game.find({}).populate({
            path: 'users',
            select: '-password',
        });
        
        res.status(200).json(games);
    } catch (err) {
        console.error("Error fetching games:", err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
}

export const getGame = async function(req, res) {
    try {
        const gameId = req.params.gameId; 
        const game = await Game.findById(gameId).populate({
            path: 'users',
            select: '-password',
        }); 
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        console.error("Error fetching game:", err);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
}

export const updateGame = async function(req, res) {
    try {
        const gameId = req.params.gameId; 
        const updatedGame = await Game.findByIdAndUpdate(gameId, req.body, { new: true }).populate({
            path: 'users',
            select: '-password',
        });
        if (!updatedGame) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(updatedGame);
    } catch (err) {
        console.error("Error updating game:", err);
        res.status(500).json({ error: 'Failed to update game' });
    }
}

export const deleteGame = async function(req, res) {
    try {
        const gameId = req.params.gameId;
        const deletedGame = await Game.findByIdAndDelete(gameId);
        if (!deletedGame) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting game:", err);
        res.status(500).json({ error: 'Failed to delete game' });
    }
}