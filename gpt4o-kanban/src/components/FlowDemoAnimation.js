import React from 'react';
import './FlowDemoAnimation.css';

function FlowDemoAnimation() {
  return (
    <div className="flow-demo-container">
      <div className="chat-interface">
        <div className="chat-header">
          <div className="chat-title">Ebb Assistant</div>
        </div>
        
        <div className="chat-messages">
          <div className="message user-message">
            <div className="message-avatar user-avatar">U</div>
            <div className="message-content">
              <div className="message-text">Hey Ebb, can you help me organize my project tasks?</div>
            </div>
          </div>
          
          <div className="message assistant-message">
            <div className="message-avatar assistant-avatar">E</div>
            <div className="message-content">
              <div className="message-text">I'd be happy to help you organize your project tasks! Let's break it down:</div>
              <div className="message-text">
                <ol>
                  <li>First, let's identify the main components of your project</li>
                  <li>Then we'll create task categories for each component</li>
                  <li>Finally, I'll help you prioritize and set up a timeline</li>
                </ol>
                Would you like to start by telling me more about your project goals?
              </div>
            </div>
          </div>
          
          <div className="message user-message">
            <div className="message-avatar user-avatar">U</div>
            <div className="message-content">
              <div className="message-text typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowDemoAnimation;
