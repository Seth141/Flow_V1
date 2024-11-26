export async function generateTasks(projectDescription) {
    try {
        const response = await fetch('/api/generate-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: projectDescription
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to generate tasks');
        }
        const tasks = await response.json();
        
        // Only add default values if fields are missing
        const processedTasks = tasks.map(task => ({
            id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: task.title,
            description: task.description,
            status: task.status || 'Backlog',
            urgency: task.urgency,  // Don't provide default
            storyPoints: task.storyPoints  // Don't provide default
        }));

        return processedTasks;
    } catch (error) {
        console.error("Error generating tasks:", error);
        throw error;
    }
}

export async function getChatResponse(message) {
    try {
        console.log('Sending chat request to backend');
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        console.log('Received response from backend', response);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get chat response');
        }
        const data = await response.json();
        console.log('Parsed response data', data);
        return data.message;
    } catch (error) {
        console.error("Error getting chat response:", error);
        throw error;
    }
}
