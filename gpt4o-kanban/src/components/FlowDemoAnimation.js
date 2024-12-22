import React from 'react';
import './FlowDemoAnimation.css';

function FlowDemoAnimation() {
  return (
    <div className="flow-demo-container">
      <svg viewBox="0 0 800 400" className="flow-demo-svg">
        {/* Terminal Window */}
        <rect className="terminal-window" x="50" y="50" width="300" height="200" rx="10"/>
        <text className="terminal-prompt" x="70" y="85">$</text>
        <text className="typing-text" x="90" y="85">
          <tspan>Hey Ebb, help me plan my project</tspan>
        </text>
        
        {/* Typing Cursor */}
        <rect className="cursor" x="85" y="75" width="2" height="15"/>
        
        {/* Assistant Response */}
        <text className="assistant-text" x="70" y="120">
          <tspan className="assistant-line">Analyzing project requirements...</tspan>
          <tspan x="70" y="145" className="assistant-line">Generating task breakdown...</tspan>
          <tspan x="70" y="170" className="assistant-line">Creating Kanban structure...</tspan>
        </text>
        
        {/* Kanban Board */}
        <g className="kanban-board" transform="translate(400, 50)">
          {/* Columns */}
          <g className="column todo">
            <rect x="0" y="0" width="100" height="250" rx="5"/>
            <text x="35" y="30">To Do</text>
          </g>
          
          <g className="column in-progress">
            <rect x="120" y="0" width="100" height="250" rx="5"/>
            <text x="140" y="30">In Progress</text>
          </g>
          
          <g className="column done">
            <rect x="240" y="0" width="100" height="250" rx="5"/>
            <text x="270" y="30">Done</text>
          </g>
          
          {/* Tasks */}
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} className={`task task-${i}`}>
              <rect x="10" y={50 + i * 40} width="80" height="30" rx="3"/>
              <line x1="20" y1={65 + i * 40} x2="70" y2={65 + i * 40} strokeWidth="2"/>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default FlowDemoAnimation;
