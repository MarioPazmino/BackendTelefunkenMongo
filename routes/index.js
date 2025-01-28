// routes/index.js
const express = require('express');
const usersRouter = require('./v1/users.router');
const gamesRouter = require('./v1/games.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/games', gamesRouter);

}

module.exports = routerApi;
