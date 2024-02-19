const express = require('express')
const router = express.Router();
const userController = require('../controllers/user')


router.post('/register', userController.register);
router.post('/login', userController.verifyUser, userController.login)
router.post('/setAvatar/:id', userController.setUserAvatar)
router.get('/allusers/:id', userController.getAllUsers)
module.exports = router