const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');

app.post('/api/generate-tasks', async (req, res) => {
  try {
    const { description } = req.body;
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          "role": "system",
          "content": `You are a project management assistant. Generate tasks with varying levels of urgency and complexity.
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
            
            DO NOT use the same urgency or story points for all tasks.`
        },
        { "role": "user", "content": description }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    let tasks;
    try {
      const response = JSON.parse(chatCompletion.choices[0].message.content);
      if (!response.tasks || !Array.isArray(response.tasks)) {
        throw new Error('Invalid response format');
      }

      tasks = response.tasks.map(task => {
        if (!task.urgency || !task.storyPoints) {
          throw new Error('Missing urgency or story points');
        }
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: task.title,
          description: task.description,
          status: task.status || "Backlog",
          urgency: task.urgency,
          storyPoints: task.storyPoints
        };
      });
    } catch (parseError) {
      console.error('Error parsing GPT-4 response:', parseError);
      throw new Error('Failed to generate valid tasks');
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Error generating tasks:', error);
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message } = req.body;
    console.log('Sending request to OpenAI');
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          "role": "system",
          "content": "You are a software engineering assistant named Ebb. Your goal is to provide detailed answers with well-written code examples when appropriate. Analyze user questions carefully and ask follow-up questions when necessary.",
        },
        { "role": "user", "content": message },
      ]
    });
    console.log('Received response from OpenAI:', chatCompletion.choices[0].message);
    res.json({ message: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Error getting chat response:', error);
    res.status(500).json({ error: 'Failed to get chat response', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
