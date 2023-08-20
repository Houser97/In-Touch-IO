const express = require('express');
const app = require('../app');
const { sendMessage } = require('../controllers/messageController');
const { validate_token } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', validate_token, sendMessage);
router.get('/:chatId', validate_token);

module.exports = router;