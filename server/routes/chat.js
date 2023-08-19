const express = require('express');
const { accessChat } = require('../controllers/chatController');
const { validate_token } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', validate_token, accessChat)

module.exports = router