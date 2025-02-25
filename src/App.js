import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ChatInterface from './pages/ChatInterface';
import KanbanBoard from './pages/KanbanBoard';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { generateTasks, getChatResponse } from './services/gptService';
import { supabase } from './services/supabaseClient';

function App() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // finally, this works. i'm not sure why authentication persistence was not working before
  // now, generating tasks and going to a new tab and kanban board, the session is still active
  // sweet.

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      console.log('Initial session:', session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        setSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
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
          kanbanWindow.postMessage(
            { type: 'TASKS_UPDATED', tasks: generatedTasks },
            '*'
          );
        };
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
    }
  };

  const handleChatMessage = async (message) => {
    try {
      const response = await getChatResponse(message);
      return response;
    } catch (error) {
      console.error('Error getting chat response:', error);
      return 'Sorry, I encountered an error while processing your request.';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {location.pathname !== '/' && <AnimatedBackground />}
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route
          path="/"
          element={<LandingPage session={session} setSession={setSession} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard currentUser={session?.user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute session={session}>
              <ChatInterface
                onProjectDescription={handleProjectDescription}
                onChatMessage={handleChatMessage}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute session={session}>
              <KanbanBoard tasks={tasks} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
