const { User } = require('../models');

const deleteUser = () => {
  return User.destroy({ where: {} })
}

module.exports = deleteUser;