module.exports = (() => {
  const UserModel = require('../models/user-model.js');
  const { Asserts } = require('../utils');

  function register(username, password) {
    Asserts.notNullOrEmpty(username, 'username');
    Asserts.notNullOrEmpty(password, 'password');
    const newUser = new UserModel({ username, password });
    return newUser.save();
  }

  function findUserByUsernameAndPassword(username, password) {
    Asserts.notNullOrEmpty(username, 'username');
    Asserts.notNullOrEmpty(password, 'password');
    return UserModel.find({ username, password });
  }

  return { register, findUserByUsernameAndPassword };
})();
