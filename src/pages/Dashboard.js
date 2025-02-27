import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function Dashboard({ currentUser }) {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate('/chat');
  };

  const handleAddProject = async () => {
    const ownerId = currentUser?.id;
    console.log('Owner id:', ownerId);
    if (!ownerId) {
      console.error('No valid user session. Cannot add project.');
      navigate('/login');
      return;
    }

    const projectData = {
      owner_id: ownerId, // using the id from the user's session
      name: 'New Project',
      description: 'A new project created from the dashboard.',
    };

    const { data, error } = await supabase.from('projects').insert(projectData);

    if (error) {
      console.error('Error adding project:', error.message);
    } else {
      console.log('Project added:', data);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={goToChat}>Go to Chat</button>
      <button onClick={handleAddProject}>Add Project</button>
    </div>
  );
}

export default Dashboard;
