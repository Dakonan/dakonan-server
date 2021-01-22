const jwt = require('jsonwebtoken')

function generateToken (payload) {
  return jwt.sign(payload, process.env.SECRET_WORD)
}

module.exports = generateToken