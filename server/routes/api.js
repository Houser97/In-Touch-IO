const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.check_email, userController.create_user);
router.post('/login', userController.login);
router.post('/get_user_data', userController.validate_token,userController.get_user_data);
router.post('/upload_image/:id', userController.validate_token,userController.upload_image)



module.exports = router