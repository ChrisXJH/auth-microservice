module.exports = (() => {
  const UserService = require('./user-service.js');
  const { Asserts } = require('../utils');
  const SessionModel = require('../models/session-model.js');

  function createUserSession(username, password) {
    Asserts.notNullOrEmpty(username, 'username');
    Asserts.notNullOrEmpty(password, 'password');
    return UserService.findUserByUsernameAndPassword(username, password).then(
      users => {
        const user = users[0];
        if (user) {
          const userId = user._id;
          SessionModel.deleteMany({ userId }).catch(err => console.error(err));
          const creationTime = new Date();
          const sessionModel = new SessionModel({ userId, creationTime });
          return sessionModel.save();
        }
        return null;
      }
    );
  }

  function getActiveUserSessionById(_id) {
    Asserts.notNullOrEmpty(_id, 'sessionId');
    return SessionModel.find({ _id }).then(sessions => sessions[0]);
  }

  return { createUserSession, getActiveUserSessionById };
})();
