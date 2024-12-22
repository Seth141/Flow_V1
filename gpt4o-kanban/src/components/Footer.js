import React from 'react';
import './Footer.css';
import flowLogo from './images/flow-logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo-container">
            <img src={flowLogo} alt="Flow Logo" className="footer-logo" />
            <span className="footer-logo-text">Flow.</span>
          </div>
        </div>

        <div className="footer-section links-section">
          <a href="#features">Features</a>
          <span className="separator">•</span>
          <a href="#about">About</a>
          <span className="separator">•</span>
          <a href="#careers">Careers</a>
          <span className="separator">•</span>
          <a href="mailto:seth141592@gmail.com">Contact</a>
        </div>

        <div className="footer-section">
          <p className="copyright">&copy; {new Date().getFullYear()} Flow</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 