const { User } = require('../models')
const { checkPassword, generateToken } = require('../helpers')

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body
      const user = {
        email,
        username,
        password,
        matchCount: 0,
        winCount: 0
      }
      const newUser = await User.create(user)
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  static async login (req, res, next) {
    try {
      const { username, password } = req.body 
      if (!username || username.length === 0 || !password || password.length === 0) {
        throw {
          status: 400,
          message: 'username or password cannot be empty'
        }
      }
      const user = await User.findOne({ where: { username } })
      if (!user) {
        throw { message: "username or password seems to be wrong", status: 404 }
      } else {
        const isPasswordMatch = checkPassword(password, user.password)
        if (isPasswordMatch) {
          const {id, username, email } = user
          const access_token = generateToken({ username, email, id })
          console.log(access_token, 'test')
          res.status(200).json({ access_token })
        } else {
          throw { message: "username or password seems to be wrong", status: 404 }
        }
      }
    } catch(err) {
      next(err)
    }
  }
}

module.exports = UserController