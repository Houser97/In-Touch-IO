const express = require('express');
const { sendMessage, chatMessages } = require('../controllers/messageController');
const { validate_token } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', validate_token, sendMessage);
router.get('/:chatId', validate_token, chatMessages);

module.exports = router;