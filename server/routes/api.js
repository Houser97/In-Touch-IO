const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/signup', userController.check_email, userController.create_user);
router.post('/login', userController.login);
router.get('/get_user_data', userController.get_user_data);



module.exports = router