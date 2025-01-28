// routes/v1/games.router.js
const express = require('express');
const router = express.Router();
const gameService = require('../../services1/gameService');
const authenticateToken = require('../../middleware/authenticateJWT');

// Crear un nuevo juego
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { creatorType, isTemporary, gameCode } = req.body;
    const newGame = await gameService.createGame(
      req.user.userId,
      creatorType,
      isTemporary,
      gameCode
    );
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unirse a un juego
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { gameCode, playerType } = req.body;
    const game = await gameService.joinGame(
      gameCode,
      req.user.userId,
      playerType
    );
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un juego por ID
router.get('/:gameId', authenticateToken, async (req, res) => {
  try {
    const game = await gameService.getGameById(req.params.gameId);
    res.status(200).json(game);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Obtener juegos activos del usuario
router.get('/user/active', authenticateToken, async (req, res) => {
  try {
    const games = await gameService.getActiveGames(req.user.userId);
    res.status(200).json(games);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un juego
router.put('/:gameId', authenticateToken, async (req, res) => {
  try {
    const game = await gameService.updateGame(req.params.gameId, req.body);
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un juego
router.delete('/:gameId', authenticateToken, async (req, res) => {
  try {
    const result = await gameService.deleteGame(req.params.gameId, req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;