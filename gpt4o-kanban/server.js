const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Memory Queue Configuration
// ------------------------
// The memory queue maintains conversation history between user and assistant
// It stores up to 6 messages (3 pairs of user-assistant interactions)
// This allows the AI to maintain context of the ongoing conversation
const memoryQueue = [];
const MAX_MEMORY = 6; 

/**
 * Updates the conversation memory queue with new messages
 * @param {string} role - Either 'user' or 'assistant'
 * @param {string} content - The message content
 * 
 * Messages are added to the end of the queue
 * If queue exceeds MAX_MEMORY, oldest messages are removed from the start
 */
function updateMemoryQueue(role, content) {
  memoryQueue.push({ role, content });
  while (memoryQueue.length > MAX_MEMORY) {
    memoryQueue.shift(); // Remove oldest message when queue is full
  }
}

/**
 * Displays the current state of the memory queue for debugging
 * Shows all stored messages with their roles and content
 * Useful for monitoring conversation flow and context retention
 */
function displayMemory() {
  console.log('\nMemory Queue Contents:');
  console.log('------------------------');
  memoryQueue.forEach((message, i) => {
    console.log(`${i + 1}. Role: ${message.role}`);
    console.log(`   Content: ${message.content.substring(0, 100)}...`);
  });
  console.log('------------------------\n');
}

// Verify OpenAI API key is configured
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');

// Chat Endpoint
// ------------
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message } = req.body;

    // Add new user message to conversation history
    updateMemoryQueue('user', message);

    // Construct the messages array for OpenAI API
    // Includes:
    // 1. System prompt defining AI's role and behavior
    // 2. Previous conversation history from memory queue
    const messages = [
      {
        "role": "system",
        "content": "You are a software engineering assistant named Ebb. Your goal is to provide detailed answers with well-written code examples when appropriate. Analyze user questions carefully and ask follow-up questions when necessary.",
      },
      ...memoryQueue // Include conversation history
    ];

    // Send request to OpenAI with full conversation context
    console.log('Sending request to OpenAI with conversation history');
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    const assistantResponse = chatCompletion.choices[0].message.content;
    
    // Add AI's response to conversation history
    updateMemoryQueue('assistant', assistantResponse);

    // Log current state of conversation memory
    displayMemory();

    res.json({ message: assistantResponse });
  } catch (error) {
    console.error('Error getting chat response:', error);
    res.status(500).json({ error: 'Failed to get chat response', details: error.message });
  }
});

// Keep existing task generation endpoint
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

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
