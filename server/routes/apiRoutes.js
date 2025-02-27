const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const chatController = require('../controllers/chatController');

router.post('/generate-tasks', tasksController.generateTasks);
router.post('/chat', chatController.chatResponse);

module.exports = router;
