const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate_token } = require('../middlewares/authMiddleware');

router.post('/signup', userController.check_email, userController.create_user);
router.post('/login', userController.login);
router.post('/get_user_data', validate_token,userController.get_user_data);
router.post('/upload_image/:id', validate_token,userController.upload_image);
router.get('/searchUser', validate_token, userController.searchUser)



module.exports = router