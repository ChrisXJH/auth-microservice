module.exports = (() => {
  const UserService = require('./user-service.js');
  const { Asserts } = require('../utils');
  const SessionModel = require('../models/session-model.js');

  class InvalidArgumentError extends Error {}

  const Errors = { InvalidArgumentError };

  function createUserSession(username, password) {
    return new Promise((resolve, reject) => {
      try {
        Asserts.notNullOrEmpty(username, 'username');
        Asserts.notNullOrEmpty(password, 'password');
        resolve(authenticateUserAndCreateSession(username, password));
      } catch (err) {
        if (err instanceof Asserts.Errors.AssertionError) {
          reject(new InvalidArgumentError(err.message));
        }
        reject(err);
      }
    });
  }

  function getActiveUserSessionById(_id) {
    return new Promise((resolve, reject) => {
      Asserts.notNullOrEmpty(_id, 'sessionId');
      SessionModel.find({ _id })
        .then(sessions => resolve(sessions[0]))
        .catch(err => reject(err));
    });
  }

  function authenticateUserAndCreateSession(username, password) {
    return UserService.authenticateUser(username, password).then(user => {
      const userId = user._id;
      return SessionModel.deleteMany({ userId }).then(() => {
        const creationTime = new Date();
        return new SessionModel({ userId, creationTime }).save();
      });
    });
  }

  return { createUserSession, getActiveUserSessionById, Errors };
})();
