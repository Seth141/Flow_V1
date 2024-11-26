const express = require('express');
const openai = require('openai');

const app = express();
const openaiClient = new openai(process.env.OPENAI_API_KEY);

app.post('/api/generate-tasks', async (req, res) => {
    try {
        const { description } = req.body;
        const chatCompletion = await openaiClient.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    "role": "system",
                    "content": `You are a project management assistant. Generate tasks with varying levels of urgency and complexity.
                        For each task:
                        1. Analyze the task's time-sensitivity and impact to assign urgency:
                            - high: critical path, blocking tasks, immediate needs
                            - medium: important but not blocking
                            - low: nice to have, can be done later
                        
                        2. Evaluate complexity for story points (1-5):
                            - 1: very simple, few hours
                            - 2: straightforward, day or less
                            - 3: moderate complexity, few days
                            - 4: complex, week or more
                            - 5: very complex, significant effort

                        Return a json object with a 'tasks' array. Each task must have:
                        {
                            "title": "task name",
                            "description": "detailed description",
                            "status": "Backlog",
                            "urgency": "high"|"medium"|"low",
                            "storyPoints": "1"|"2"|"3"|"4"|"5"
                        }`
                },
                { "role": "user", "content": description }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        let tasks = JSON.parse(chatCompletion.choices[0].message.content);
        
        // Only add ID and status if missing, preserve urgency and story points
        const formattedTasks = tasks.tasks.map(task => ({
            ...task,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            status: task.status || "Backlog"
        }));

        res.json(formattedTasks);
    } catch (error) {
        console.error('Error generating tasks:', error);
        res.status(500).json({ error: 'Failed to generate tasks' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
}); 