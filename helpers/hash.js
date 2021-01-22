const bcrypt = require('bcryptjs')

module.exports = function hash (string) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(string, salt)
  return hash
}
