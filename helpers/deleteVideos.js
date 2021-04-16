const { Video } = require('../models');

const deleteVideos = () => {
  return Video.destroy({ where: {} })
}

module.exports = deleteVideos;