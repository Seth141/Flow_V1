import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import KanbanBoard from './components/KanbanBoard';
import LandingPage from './components/LandingPage';
import { generateTasks, getChatResponse } from './services/gptService';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';

import { supabase } from './services/supabaseClient';

function App() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log('Session set:', session);
    });

    console.log('Initial session:', session);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

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
        <Route path="/" element={<LandingPage setSession={setSession} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            session ? (
              <ChatInterface
                onProjectDescription={handleProjectDescription}
                onChatMessage={handleChatMessage}
              />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/kanban" element={<KanbanBoard tasks={tasks} />} />
      </Routes>
    </div>
  );
}

export default App;
