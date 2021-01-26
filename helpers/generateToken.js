const jwt = require('jsonwebtoken')

module.exports = function generateToken (payload) {
  // console.log(payload, 'di helper')
  return jwt.sign(payload, 'hiha')
}

