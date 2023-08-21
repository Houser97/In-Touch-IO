const express = require('express');
const { ChatAndMessages } = require('../controllers/chatController');
const { sendMessage } = require('../controllers/messageController');
const { validate_token } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', validate_token, sendMessage);
router.get('/:chatId', validate_token, ChatAndMessages);

module.exports = router;