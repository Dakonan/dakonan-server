const jwt = require('jsonwebtoken')

module.exports = function decodeToken (token) {
  return jwt.verify(token, process.env.SECRET_WORD)
}