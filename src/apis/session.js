module.exports = (() => {
  const express = require('express');
  const mongoose = require('mongoose');
  const { AssertionError } = require('../utils');
  const { SessionService } = require('../services');
  const router = express.Router();

  router.post('/', (req, res) => {
    try {
      const { username, password } = req.body;
      SessionService.createUserSession(username, password).then(newSession => {
        if (newSession) {
          const { _id } = newSession;
          res.send({ _id });
        }
        const message =
          'Could not create session with given username and password.';
        console.error(message);
        res.send({
          message
        });
      });
    } catch (err) {
      handleErrorAndRespond(err, res);
    }
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
    if (err instanceof AssertionError) {
      status = 400;
    } else if (err instanceof mongoose.Error.CastError) {
      message = `Invalid sessionId.`;
    }
    res.status(status).send({ status, message });
  }

  return router;
})();
