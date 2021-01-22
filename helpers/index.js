const hash = require('./hash')
const checkPassword = require('./checkPassword')
const generateToken = require('./generateToken')
const decodeToken = require('./decodeToken')

module.exports = {
  hash,
  checkPassword,
  generateToken,
  decodeToken
}