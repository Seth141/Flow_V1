import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "./LoginPage.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signUp(
      { email, password },
      { data: {user_name: name}}
    );
    if (error) {
      setError(error.message);
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
