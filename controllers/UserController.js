const { User } = require('../models')
const { checkPassword, generateToken } = require('../helpers')

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body
      const newUser = await User.create({ username, email, password })
      res.status(201).json({
        username: newUser.username,
        email: newUser.email,
        matchCount: newUser.matchCount,
        winCount: newUser.winCount
      })
    } catch (err) {
      console.log(err)
    }
  }

  static async login (req, res, next) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ where: { username } })
      
      if (!user) {
        throw { message: "username or password might be wrong", status: 404 }
      } else {
        const isPasswordMatch = checkPassword(password, user.password)
        if (isPasswordMatch) {
          const { username, email } = user
          const access_token = generateToken({ username, email })
          res.status(200).json({ access_token })
        } else {
          throw { message: "username or password might be wrong", status: 404 }
        }
      }
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = UserController