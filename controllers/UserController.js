const { User } = require('../models')
const { checkPassword, generateToken } = require('../helpers')
const decodeToken = require('../helpers/decodeToken')

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
          // console.log(access_token, 'test')
          res.status(200).json({ access_token })
        } else {
          throw { message: "username or password seems to be wrong", status: 404 }
        }
      }
    } catch(err) {
      next(err)
    }
  }

  static async win (req, res, next) {
    try {
      // const { access_token } = req.headers
      // const decodedToken = await decodeToken(access_token, 'hiha')
      // const username = decodedToken.username
      const { username } = req.headers
      const user = await User.findOne({ where: { username } })
      const id = user.dataValues.id
      const matchCount = user.dataValues.matchCount
      const winCount = user.dataValues.winCount
      // console.log('match:', matchCount, ' win:', winCount)
      const updateUser = {
        matchCount: (matchCount+(0.5)),
        winCount: (winCount+(0.5))
      }
      const update = await User.update(updateUser, {
        where: {
          id
        },
        returning: true
      })
      const data = update[1][0]
      res.status(200).json(data)
    }catch(err) {
      next(err)
    }
    
  }

  static async lose (req, res, next) {
    try {
      // const { access_token } = req.headers
      // const decodedToken = await decodeToken(access_token, 'hiha')
      // const username = decodedToken.username
      const { username } = req.headers
      const user = await User.findOne({ where: { username } })
      const id = user.dataValues.id
      const matchCount = user.dataValues.matchCount
      // console.log('match:', matchCount, ' win:', winCount)
      const updateUser = {
        matchCount: matchCount+0.5,
      }
      const update = await User.update(updateUser, {
        where: {
          id
        },
        returning: true
      })
      const data = update[1][0]
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }

  static async getLeaderBoard(req, res, next) {
    // res.status(200).json('masuk leaderboard')
    try {
      const users = await User.findAll({
        attributes: ['username', 'matchCount', 'winCount'],
        raw: true
      })
      // console.log(users)
      const data = users.map((el) => {
        const winRate = Math.floor(el.winCount/el.matchCount*100)
        const data = {
          username: el.username,
          matchCount: el.matchCount,
          winRate: winRate || 0
        }
        return data
      })
      /* istanbul ignore next */
      function compare( a, b ) {
        if ( a.winRate > b.winRate ){
          return -1;
        }
        if ( a.winRate < b.winRate ){
          return 1;
        }
        return 0;
      }
      data.sort(compare)
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController