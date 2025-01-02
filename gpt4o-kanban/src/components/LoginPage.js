import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './LoginPage.css';


const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
  console.log('Initiating Google login...');
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/chat'
      }
    });
    if (error) {
      console.log('Google login error:', error.message);
    } else {
      console.log('Google login successful, session:', session);
    }
  };

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error logging in with email:', error.message);
    } else {
      navigate('/chat');
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      navigate('/chat');
    }
  };

  return (
    <div className="login-page">
      <h1>Login to Flow</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailLogin}>Login with Email</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
