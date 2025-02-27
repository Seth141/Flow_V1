const openai = require('./openaiClient');

module.exports.generateTasks = async (description) => {
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a project management assistant. Generate tasks with varying levels of urgency and complexity.
                    IMPORTANT: Each task MUST include both urgency and story points in json format.

                    For each task you MUST:
                    1. Set urgency to exactly one of: "high", "medium", or "low"
                    2. Set storyPoints to exactly one of: "1", "2", "3", "4", or "5"

                    Example response format:
                    {
                        "tasks": [
                        {
                            "title": "Set up database",
                            "description": "Configure and initialize the PostgreSQL database",
                            "status": "Backlog",
                            "urgency": "high",
                            "storyPoints": "4"
                        }
                        ]
                    }

                    Make sure each task has different urgency levels and story points based on:
                    - Urgency: task importance and time-sensitivity
                    - Story Points: task complexity and effort required

                    DO NOT use the same urgency or story points for all tasks.`,
      },
      { role: 'user', content: description },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  let tasks;
  try {
    const response = JSON.parse(chatCompletion.choices[0].message.content);
    if (!response.tasks || !Array.isArray(response.tasks)) {
      throw new Error('Invalid response format');
    }

    tasks = response.tasks.map((task) => {
      if (!task.urgency || !task.storyPoints) {
        throw new Error('Missing urgency or story points');
      }
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: task.title,
        description: task.description,
        status: task.status || 'Backlog',
        urgency: task.urgency,
        storyPoints: task.storyPoints,
      };
    });
  } catch (parseError) {
    console.error('Error parsing GPT-4 response in gptService:', parseError);
    throw new Error('Failed to generate valid tasks');
  }

  return tasks;
};
