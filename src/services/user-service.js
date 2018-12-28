module.exports = (() => {
  const UserModel = require('../models/user-model.js');
  const { Asserts } = require('../utils');

  class DuplicatedUserError extends Error {}
  class UserNotFoundError extends Error {}
  class InvalidArgumentError extends Error {}

  const Errors = {
    DuplicatedUserError,
    UserNotFoundError,
    InvalidArgumentError
  };

  function register(username, password) {
    return new Promise((resolve, reject) => {
      try {
        Asserts.notNullOrEmpty(username, 'username');
        Asserts.notNullOrEmpty(password, 'password');
        resolve(doCreateNewUser(username, password));
      } catch (err) {
        if (err instanceof Asserts.Errors.AssertionError) {
          reject(new InvalidArgumentError(err.message));
        }
        reject(err);
      }
    });
  }

  function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
      try {
        Asserts.notNullOrEmpty(username, 'username');
        Asserts.notNullOrEmpty(password, 'password');

        findUserByUsernameAndPassword(username, password).then(users => {
          if (users[0]) {
            const { _id } = users[0];
            resolve({ _id, username });
          }
          reject(
            new UserNotFoundError(
              `Could not find user with given username and password.`
            )
          );
        });
      } catch (err) {
        if (err instanceof Asserts.Errors.AssertionError) {
          reject(new InvalidArgumentError(err.message));
        }
        reject(err);
      }
    });
  }

  function findUserByUsernameAndPassword(username, password) {
    return UserModel.find({ username, password });
  }

  function doCreateNewUser(username, password) {
    return UserModel.find({ username }).then(results => {
      if (results.length) {
        throw new DuplicatedUserError(
          `User with username '${username}' already exists.`
        );
      }
      return new UserModel({ username, password }).save();
    });
  }

  return { register, authenticateUser, Errors };
})();
