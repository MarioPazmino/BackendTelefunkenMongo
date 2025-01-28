const Game = require('../models/Game');
const { v4: uuidv4 } = require('uuid');

const gameService = {
  async createGame(userId, creatorType, isTemporary = false, gameCode = null) {
    const code = gameCode || generateGameCode();
    const gameId = uuidv4();
    
    const game = new Game({
      code,
      gameId,
      title: `Game ${code}`,
      createdBy: userId,
      creatorType,
      isTemporary,
      players: [userId],
      expiresAt: isTemporary ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null // 24 horas si es temporal
    });

    await game.save();
    return game;
  },

  async joinGame(gameCode, userId, playerType) {
    const game = await Game.findOne({ code: gameCode });
    
    if (!game) {
      throw new Error('Juego no encontrado');
    }

    if (game.players.includes(userId)) {
      throw new Error('El jugador ya está en el juego');
    }

    if (game.expiresAt && game.expiresAt < new Date()) {
      throw new Error('El juego ha expirado');
    }

    game.players.push(userId);
    await game.save();
    
    return game;
  },

  async getGameById(gameId) {
    const game = await Game.findOne({ gameId })
                          .populate('createdBy', 'name username')
                          .populate('players', 'name username');
    
    if (!game) {
      throw new Error('Juego no encontrado');
    }

    return game;
  },

  async getActiveGames(userId) {
    return await Game.find({
      players: userId,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    }).populate('players', 'name username');
  },

  async updateGame(gameId, updateData) {
    const game = await Game.findOneAndUpdate(
      { gameId },
      updateData,
      { new: true }
    ).populate('players', 'name username');

    if (!game) {
      throw new Error('Juego no encontrado');
    }

    return game;
  },

  async deleteGame(gameId, userId) {
    const game = await Game.findOne({ gameId });
    
    if (!game) {
      throw new Error('Juego no encontrado');
    }

    if (game.createdBy.toString() !== userId) {
      throw new Error('No autorizado para eliminar este juego');
    }

    await game.deleteOne();
    return { message: 'Juego eliminado exitosamente' };
  }
};

// Función auxiliar para generar códigos de juego
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = gameService;