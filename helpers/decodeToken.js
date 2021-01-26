const jwt = require('jsonwebtoken')

module.exports = function decodeToken (token, secretWordFromTest) {
  return jwt.verify(token, process.env.SECRET_WORD || secretWordFromTest)
}