import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import KanbanBoard from './components/KanbanBoard';
import LandingPage from './components/LandingPage';
import { generateTasks, getChatResponse } from './services/gptService';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';

function App() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const handleProjectDescription = async (description) => {
    try {
      const generatedTasks = await generateTasks(description);
      setTasks(generatedTasks);
      localStorage.setItem('tasks', JSON.stringify(generatedTasks));
      
      const kanbanWindow = window.open('/kanban', '_blank');
      if (kanbanWindow) {
        kanbanWindow.onload = () => {
          kanbanWindow.postMessage({ type: 'TASKS_UPDATED', tasks: generatedTasks }, '*');
        };
      }
    } catch (error) {
      console.error("Error generating tasks:", error);
    }
  };

  const handleChatMessage = async (message) => {
    try {
      const response = await getChatResponse(message);
      return response;
    } catch (error) {
      console.error("Error getting chat response:", error);
      return "Sorry, I encountered an error while processing your request.";
    }
  };

  return (
    <div className="App">
      {location.pathname !== '/' && <AnimatedBackground />}
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatInterface onProjectDescription={handleProjectDescription} onChatMessage={handleChatMessage} />} />
        <Route path="/kanban" element={<KanbanBoard tasks={tasks} />} />
      </Routes>
    </div>
  );
}

//export default here: 
export default App;



