const express = require('express');
const { accessChat, findUserChats } = require('../controllers/chatController');
const { validate_token } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', validate_token, accessChat);
router.get('/getChats', validate_token, findUserChats);

module.exports = router