module.exports = (() => {
  const express = require('express');
  const mongoose = require('mongoose');
  const { SessionService, UserService } = require('../services');
  const router = express.Router();

  router.post('/', (req, res) => {
    const { username, password } = req.body;
    SessionService.createUserSession(username, password)
      .then(newSession => {
        const { _id } = newSession;
        res.send({ _id });
      })
      .catch(err => handleErrorAndRespond(err, res));
  });

  router.get('/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    SessionService.getActiveUserSessionById(sessionId)
      .then(session => {
        if (session) {
          const { _id } = session;
          res.send({ _id });
        } else {
          const message = `User session with sessionid '${sessionId}' not found.`;
          const status = 404;
          console.error(message);
          res.status(status).send({ status, message });
        }
      })
      .catch(err => handleErrorAndRespond(err, res));
  });

  function handleErrorAndRespond(err, res) {
    let message = err.message;
    console.error(message);
    let status = 500;
    if (err instanceof UserService.Errors.UserNotFoundError) {
      status = 400;
    } else if (err instanceof mongoose.Error.CastError) {
      message = `Invalid sessionId.`;
    }
    res.status(status).send({ status, message });
  }

  return router;
})();
