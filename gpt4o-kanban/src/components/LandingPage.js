import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import './FeatureCards.css';
import './CircleAnimation.css';
import flowLogo from './images/flow-logo.png';
import Footer from './Footer';

function LandingPage({ setSession }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.menu-content') && !e.target.closest('.hamburger-menu')) {
      toggleMenu();
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="header-content">
          <div className="logo-container">
            <img src={flowLogo} alt="Flow Logo" className="header-logo" />
          </div>
          <div className="header-title">Flow.</div>
          <button className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      <div 
        className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}
      >
        <nav className="menu-content">
          <a href="#" onClick={(e) => { 
            e.preventDefault(); // Prevent default navigation
            toggleMenu(); 
          }}>
            Login
          </a>
          <a href="#about" onClick={toggleMenu}>
            About
          </a>
          <a href="#careers" onClick={toggleMenu}>
            Careers
          </a>
          <a href="mailto:seth141592@gmail.com" onClick={toggleMenu}>
            Contact
          </a>
        </nav>
      </div>

      <div className="landing-content">
        <div className="landing-main">
          <h1 className="landing-title animate-rise">Welcome to Flow.</h1>
          <p className="landing-description">
            Transform your project planning with Flow - where AI meets intuitive task management. 
            <span className="underline-animation generate">Generate</span>, 
            <span className="underline-animation organize">organize</span>, and 
            <span className="underline-animation track">track</span> your project tasks 
            effortlessly with our intelligent Kanban system.
          </p>
          <button 
            className="start-button"
            onClick={() => navigate('/login')}
          >
            Try Flow
          </button>
        </div>
        <div className="landing-animation">
          <div className="circle-container">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
            <div className="circle circle5"></div>
            <div className="circle circle6"></div>
            <div className="circle circle7"></div>
          </div>
        </div>
      </div>
      
      <div className="feature-cards">
        <div className="feature-card" style={{"--card-index": 1}}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {/* Input Layer */}
              <circle cx="4" cy="8" r="2" className="node input-node"/>
              <circle cx="4" cy="16" r="2" className="node input-node"/>
              
              {/* Hidden Layer */}
              <circle cx="12" cy="6" r="2" className="node hidden-node"/>
              <circle cx="12" cy="18" r="2" className="node hidden-node"/>
              
              {/* Output Layer */}
              <circle cx="20" cy="8" r="2" className="node output-node"/>
              <circle cx="20" cy="16" r="2" className="node output-node"/>
              
              {/* Connections from Input to Hidden */}
              <path d="M6 8L10 6" className="connection input-connection"/>
              <path d="M6 8L10 18" className="connection input-connection"/>
              <path d="M6 16L10 6" className="connection input-connection"/>
              <path d="M6 16L10 18" className="connection input-connection"/>
              
              {/* Connections from Hidden to Output */}
              <path d="M14 6L18 8" className="connection output-connection"/>
              <path d="M14 6L18 16" className="connection output-connection"/>
              <path d="M14 18L18 8" className="connection output-connection"/>
              <path d="M14 18L18 16" className="connection output-connection"/>
            </svg>
          </div>
          <h2>AI-Powered Planning</h2>
          <p>Let Flow analyze your project requirements and automatically generate structured task breakdowns, saving hours of planning time.</p>
        </div>
        
        <div className="feature-card" style={{"--card-index": 2}}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round"/>
              <path d="M3 9h18" strokeLinecap="round"/>
              <path d="M9 3v18" strokeLinecap="round"/>
              <circle cx="6" cy="6" r="1" strokeLinecap="round"/>
              <circle cx="12" cy="6" r="1" strokeLinecap="round"/>
              <rect x="11" y="11" width="4" height="4" strokeLinecap="round"/>
              <path d="M15 15l2 2M17 17l-2-2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Smart Organization</h2>
          <p>Intelligent task categorization and priority management helps keep your engineering workflow smooth and efficient.</p>
        </div>
        
        <div className="feature-card" style={{"--card-index": 3}}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4v16h16" strokeLinecap="round" strokeLinejoin="round"/>
              <path className="chart-line" d="M4 16l4-4 4 2 4-6 4 2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="12" r="1" className="chart-point"/>
              <circle cx="12" cy="14" r="1" className="chart-point"/>
              <circle cx="16" cy="8" r="1" className="chart-point"/>
              <circle cx="20" cy="10" r="1" className="chart-point"/>
            </svg>
          </div>
          <h2>Progress Tracking</h2>
          <p>Visual progress indicators and automated status updates keep your entire team aligned and moving forward.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
