const bcrypt = require('bcryptjs')

module.exports = function checkPassword (string, hashedString) {
  return bcrypt.compareSync(string, hashedString)
}
