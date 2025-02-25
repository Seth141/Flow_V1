const gptService = require('../services/gptService');

module.exports.generateTasks = async (req, res) => {
  try {
    const { description } = req.body;
    const tasks = await gptService.generateTasks(description);
    res.json(tasks);
  } catch (error) {
    console.error('Error in tasksController.generateTasks:', error);
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
};
