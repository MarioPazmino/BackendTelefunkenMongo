const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorType: {
    type: String,
    required: true
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
});

// Método para guardar (reemplaza el método que causaba recursión)
gameSchema.methods.saveGame = async function() {
  return await mongoose.model('Game').create(this);
};

// Método para actualizar
gameSchema.methods.update = async function(updateData) {
  Object.assign(this, updateData);
  return await mongoose.model('Game').findByIdAndUpdate(
    this._id,
    this.toObject(),
    { new: true }
  );
};

// Método estático para búsqueda por gameId
gameSchema.statics.findByGameId = function(gameId) {
  return this.findOne({ gameId: gameId });
};

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;