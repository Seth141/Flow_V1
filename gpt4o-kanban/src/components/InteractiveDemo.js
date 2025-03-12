import React, { useState, useEffect, useRef } from 'react';
import './InteractiveDemo.css';
import PurpleStreamEffect from './PurpleStreamEffect';
import TaskMaterialization from './TaskMaterialization';

function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const demoRef = useRef(null);

  const steps = [
    {
      title: "Describe Your Project",
      description: "Start by telling Flow about your project goals, team size, ideal timeline, and requirements.",
      icon: (
        <svg viewBox="0 0 24 24" className="step-icon">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
      animation: "fade-in-right"
    },
    {
      title: "AI Task Generation",
      description: "Flow's AI breaks down your project into organized, actionable tasks.",
      icon: (
        <svg viewBox="0 0 24 24" className="step-icon">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
        </svg>
      ),
      animation: "scale-in"
    },
    {
      title: "Intelligent Organization",
      description: "Tasks are automatically categorized and prioritized in your Kanban board.",
      icon: (
        <svg viewBox="0 0 24 24" className="step-icon">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
      animation: "fade-in-left"
    },
    {
      title: "Track & Optimize",
      description: "Flow automatically monitors progress, adjusts priorities, and keeps your team pushing forward.",
      icon: (
        <svg viewBox="0 0 24 24" className="step-icon">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-7 7z" />
        </svg>
      ),
      animation: "bounce-in"
    }
  ];

  // Observer for animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (demoRef.current) {
      observer.observe(demoRef.current);
    }

    return () => {
      if (demoRef.current) {
        observer.unobserve(demoRef.current);
      }
    };
  }, []);

  // Auto-advance steps
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  // Mouse movement effect for detail items
  useEffect(() => {
    const detailItems = document.querySelectorAll('.detail-item');
    const actionButtons = document.querySelectorAll('.action-button');
    
    const handleMouseMove = (event, element) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      const highlightEffect = element.querySelector('.detail-highlight-effect, .button-hover-effect');
      if (highlightEffect) {
        highlightEffect.style.setProperty('--x', `${x}%`);
        highlightEffect.style.setProperty('--y', `${y}%`);
      }
    };
    
    detailItems.forEach(item => {
      item.addEventListener('mousemove', (e) => handleMouseMove(e, item));
    });
    
    actionButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => handleMouseMove(e, button));
    });
    
    return () => {
      detailItems.forEach(item => {
        item.removeEventListener('mousemove', (e) => handleMouseMove(e, item));
      });
      
      actionButtons.forEach(button => {
        button.removeEventListener('mousemove', (e) => handleMouseMove(e, button));
      });
    };
  }, [isVisible, activeStep]);

  return (
    <div className="interactive-demo-container" ref={demoRef}>
      <h2 className="demo-title">How Flow Works</h2>
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-indicator ${index === activeStep ? 'active' : ''}`}
            onClick={() => setActiveStep(index)}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step.title}</div>
          </div>
        ))}
      </div>
      
      <div className="demo-content">
        <div className="step-details">
          <div className="step-icon-container">
            {steps[activeStep].icon}
          </div>
          <h3 className="step-title">{steps[activeStep].title}</h3>
          <p className="step-description">{steps[activeStep].description}</p>
        </div>
        
        <div className="step-visualization">
          <div className={`animation-container ${isVisible ? steps[activeStep].animation : ''}`}>
            {activeStep === 0 && (
              <div className="visualization-content project-description-visualization">
                <div className="simple-chat-container">
                  <div className="chat-messages">
                    <div className="assistant-message simple-fade-in" style={{"--fade-delay": "0.2s"}}>
                      <div className="message-avatar">
                        <svg viewBox="0 0 24 24" className="message-avatar-icon">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                      </div>
                      <div className="message-content">
                        <p>Hi there! I'm your Flow assistant. Tell me about your project and I'll help organize it.</p>
                      </div>
                    </div>
                    
                    <div className="user-message simple-fade-in" style={{"--fade-delay": "0.6s"}}>
                      <div className="message-content">
                        <p>We need to build an e-commerce platform with product listings, shopping cart, and secure checkout.</p>
                      </div>
                      <div className="message-avatar user-avatar">
                        <span>U</span>
                      </div>
                    </div>
                    
                    <div className="assistant-message simple-fade-in" style={{"--fade-delay": "1.0s"}}>
                      <div className="message-avatar">
                        <svg viewBox="0 0 24 24" className="message-avatar-icon">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                      </div>
                      <div className="message-content">
                        <p>Thanks for the information. Flow is generating your Kanban board with detailed tasks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeStep === 1 && (
              <div className="visualization-content ai-visualization">
                <div className="task-generation">
                  {[
                    { text: "Set up product database schema", color: "rgb(109, 85, 206)", delay: 0, instant: true },
                    { text: "Create product listing component", color: "rgb(147, 112, 219)", delay: 200 },
                    { text: "Implement shopping cart functionality", color: "rgb(126, 87, 194)", delay: 400 },
                    { text: "Set up payment gateway integration", color: "rgb(94, 53, 177)", delay: 600 }
                  ].map((task, index) => (
                    <div 
                      key={index}
                      className={`task task-color-${index + 1}`}
                      style={{ opacity: task.instant ? 1 : 0 }}
                    >
                      {task.text}
                      {!task.instant && (
                        <TaskMaterialization
                          task={task.text}
                          delay={task.delay}
                          color={task.color}
                          onComplete={() => {
                            const taskElement = document.querySelector(`.task-color-${index + 1}`);
                            if (taskElement) {
                              taskElement.style.opacity = 1;
                              taskElement.style.transition = 'opacity 0.5s ease';
                            }
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="visualization-content kanban-visualization">
                <div className="kanban-board">
                  <div className="kanban-column">
                    <div className="column-header">To Do</div>
                    <div className="task-card">Set up payment gateway</div>
                    <div className="task-card">User authentication</div>
                    <div className="task-card">Order tracking system</div>
                    <div className="task-card">Email notifications</div>
                  </div>
                  <div className="kanban-column">
                    <div className="column-header">In Progress</div>
                    <div className="task-card">Product listing component</div>
                    <div className="task-card">Shopping cart functionality</div>
                    <div className="task-card">Search filters</div>
                  </div>
                  <div className="kanban-column">
                    <div className="column-header">Done</div>
                    <div className="task-card">Database schema</div>
                    <div className="task-card">API endpoints</div>
                    <div className="task-card">User registration</div>
                    <div className="task-card">Basic layout</div>
                  </div>
                </div>
              </div>
            )}
            
            {activeStep === 3 && (
              <div className="visualization-content tracking-visualization">
                <div className="progress-chart">
                  <div className="chart-bar" style={{"--height": "65%"}}>
                    <span className="bar-label">Sprint 1</span>
                  </div>
                  <div className="chart-bar" style={{"--height": "85%"}}>
                    <span className="bar-label">Sprint 2</span>
                  </div>
                  <div className="chart-bar animated-bar" style={{"--height": "95%"}}>
                    <span className="bar-label">Sprint 3</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="business-impact">
        <h3 className="impact-title">The Flow Advantage</h3>
        
        <div className="impact-metrics">
          <div className="metric" id="metric-1">
            <PurpleStreamEffect containerId="metric-1" />
            <div className="metric-value">
              <span className="counter">40</span>%
            </div>
            <div className="metric-label">Time Saved in Planning</div>
          </div>
          
          <div className="metric" id="metric-2">
            <PurpleStreamEffect containerId="metric-2" />
            <div className="metric-value">
              <span className="counter">30</span>%
            </div>
            <div className="metric-label">Faster Project Completion</div>
          </div>
          
          <div className="metric" id="metric-3">
            <PurpleStreamEffect containerId="metric-3" />
            <div className="metric-value">
              $<span className="counter">15</span>K
            </div>
            <div className="metric-label">Average Monthly Savings</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveDemo; 