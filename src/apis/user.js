module.exports = (() => {
  const { UserService } = require('../services');
  const express = require('express');
  const router = express.Router();

  router.post('/', logRequest, (req, res) => {
    const { username, password } = req.body;
    UserService.register(username, password)
      .then(newUser => {
        const { _id, username } = newUser;
        res.send({ _id, username });
      })
      .catch(err => handleErrorAndRespond(err, res));
  });

  function handleErrorAndRespond(err, res) {
    const message = err.message;
    console.error(message);
    let status = 500;
    if (
      err instanceof UserService.Errors.InvalidArgumentError ||
      err instanceof UserService.Errors.DuplicatedUserError
    ) {
      status = 400;
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
