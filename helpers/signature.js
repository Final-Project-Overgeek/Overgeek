const sha512 = require("js-sha512");

function signature(payload) {
  return sha512(payload)
}

module.exports = signature 