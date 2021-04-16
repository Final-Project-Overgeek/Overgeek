const { Lecturer } = require('../models');

const deleteLecturer = () => {
  return Lecturer.destroy({ where: {} })
}

module.exports = deleteLecturer;