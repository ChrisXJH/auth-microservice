module.exports = (() => {
  const express = require('express');
  const { SessionService, UserService } = require('../services');
  const router = express.Router();

  router.post('/', logRequest, (req, res) => {
    const { username, password } = req.body;
    SessionService.createUserSession(username, password)
      .then(newSession => {
        const { _id } = newSession;
        res.send({ _id });
      })
      .catch(err => handleErrorAndRespond(err, res));
  });

  router.get('/:sessionId', logRequest, (req, res) => {
    const { sessionId } = req.params;
    SessionService.getActiveUserSessionById(sessionId)
      .then(session => {
        const { _id } = session;
        res.send({ _id });
      })
      .catch(err => handleErrorAndRespond(err, res));
  });

  function handleErrorAndRespond(err, res) {
    let message = err.message;
    console.error(message);
    let status = 500;
    if (
      err instanceof UserService.Errors.UserNotFoundError ||
      err instanceof SessionService.Errors.InvalidArgumentError
    ) {
      status = 400;
    } else if (err instanceof SessionService.Errors.SessionNotFoundError) {
      status = 404;
    }
    res.status(status).send({ status, message });
  }

  function logRequest(req, res, next) {
    const { headers, params, query, body } = req;
    console.log('Handling incomming http request...');
    console.log({ headers, params, query, body });
    next();
  }

  return router;
})();
