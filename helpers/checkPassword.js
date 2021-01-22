const bcrypt = require('bcryptjs')

function checkPassword (string, hashedString) {
  return bcrypt.compareSync(string, hashedString)
}

module.exports = checkPassword