module.exports = (() => {
  const { AssertionError } = require('../utils');
  const { UserService } = require('../services');
  const express = require('express');
  const router = express.Router();

  router.post('/', (req, res) => {
    try {
      const { username, password } = req.body;
      UserService.register(username, password).then(newUser => {
        const { _id, username } = newUser;
        res.send({ _id, username });
      });
    } catch (err) {
      handleErrorAndRespond(err, res);
    }
  });

  function handleErrorAndRespond(err, res) {
    const message = err.message;
    console.error(message);
    let status = 500;
    if (err instanceof AssertionError) {
      status = 400;
    }
    res.status(status).send({ status, message });
  }

  return router;
})();
