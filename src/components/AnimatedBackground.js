import React from 'react';
import './AnimatedBackground.css';

function AnimatedBackground() {
  return (
    <div className="animated-background">
      <div className="bg-shape1 bg-objectOne opacity-50 bg-blur"></div>
      <div className="bg-shape2 bg-objectTwo opacity-50 bg-blur"></div>
      <div className="bg-shape3 bg-objectThree opacity-50 bg-blur"></div>
    </div>
  );
}

export default AnimatedBackground;
