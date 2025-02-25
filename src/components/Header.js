import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import './Header.css';
import flowLogo from '../assets/images/flow-logo.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header-container">
      <div className="header-content">
        <div className="logo-text-container">
          <img src={flowLogo} alt="Flow Logo" className="header-logo" />
          <TypeAnimation
            sequence={[
              'Flow.',
              3000,
              'Plan faster.',
              3000,
              'Build more.',
              8000,
              // 'Get things done.',
            ]}
            wrapper="span"
            speed={40}
            repeat={Infinity}
            className="typing-text"
          />
        </div>
        <button className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Header;
