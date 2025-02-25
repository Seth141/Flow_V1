const chatService = require('../services/chatService');

module.exports.chatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const responseMessage = await chatService.generateChatResponse(message);
    res.json({ message: responseMessage });
  } catch (error) {
    console.error('Error in chatController.chatResponse:', error);
    res
      .status(500)
      .json({ error: 'Failed to get chat response', details: error.message });
  }
};
