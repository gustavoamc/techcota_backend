const router = require('express').Router()

const UserController = require('../controllers/UserController')
const verifyToken = require('../middlewares/verifyToken')
const { imageUpload } = require('../middlewares/image-upload')

router.post('/register', imageUpload.single('logo'), UserController.register)
router.post('/login', UserController.login)
router.get('/settings', verifyToken, UserController.getUserSettings)
router.patch('/settings', verifyToken, imageUpload.single('logo'), UserController.updateUserSettings)

module.exports = router