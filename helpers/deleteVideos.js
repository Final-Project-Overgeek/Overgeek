const { Videos } = require('../models');

const deleteVideos = () => {
  return Videos.destroy({ where: {} })
}

module.exports = deleteVideos;