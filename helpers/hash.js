const bcrypt = require('bcryptjs')

function hash (string) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(string, salt)
  return hash
}

module.exports = hash