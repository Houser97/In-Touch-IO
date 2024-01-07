const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate_token } = require('../middlewares/authMiddleware');

router.post('/signup', userController.check_email, userController.create_user);
router.post('/login', userController.login);
router.get('/', validate_token, userController.searchUser);
router.get('/:userId', validate_token, userController.get_user_data);
router.post('/:userId', validate_token, userController.update_user);



module.exports = router