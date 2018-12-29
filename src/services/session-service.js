module.exports = (() => {
  const UserService = require('./user-service.js');
  const mongoose = require('mongoose');
  const { Asserts } = require('../utils');
  const SessionModel = require('../models/session-model.js');

  class InvalidArgumentError extends Error {}
  class SessionNotFoundError extends Error {}

  const Errors = { InvalidArgumentError, SessionNotFoundError };

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
      try {
        Asserts.notNullOrEmpty(_id, 'sessionId');
        SessionModel.findOne({ _id })
          .then(session => {
            if (!session) {
              reject(
                new SessionNotFoundError(
                  `Could not find user session with given sessionId`
                )
              );
            }
            resolve(session);
          })
          .catch(err => {
            if (err instanceof mongoose.Error.CastError) {
              reject(new InvalidArgumentError(`Invalid sessionId '${_id}'.`));
            }
          });
      } catch (err) {
        if (err instanceof Asserts.Errors.AssertionError) {
          reject(new InvalidArgumentError(err.message));
        }
        reject(err);
      }
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
