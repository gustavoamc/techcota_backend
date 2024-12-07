const router = require('express').Router()

const UserController = require('../controllers/UserController')
const verifyToken = require('../middlewares/verifyToken')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/settings', verifyToken, UserController.getUserSettings)
router.patch('/settings', verifyToken, UserController.updateUserSettings)

module.exports = router