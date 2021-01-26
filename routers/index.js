const router = require('express').Router()
const UserController = require('../controllers/UserController')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/win', UserController.win)
router.post('/lose', UserController.lose)
router.get('/leaderboard', UserController.getLeaderBoard)

module.exports = router