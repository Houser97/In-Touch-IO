const express = require('express');
const { sendMessage, chatMessages, updateMsgsToSeen } = require('../controllers/messageController');
const { validate_token } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', validate_token, sendMessage);
router.post('/:chatId', validate_token, chatMessages); // Buscar mensajes de un chat y coloca mensajes no vistos en vistos.
router.post('/update_messages_to_seen', validate_token, updateMsgsToSeen); // Buscar mensajes de un chat y coloca mensajes no vistos en vistos.

module.exports = router;