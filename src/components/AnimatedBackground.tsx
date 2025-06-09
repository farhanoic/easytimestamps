import React from 'react';
import '../styles/animations.css';

interface AnimatedBackgroundProps {
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating Shapes */}
      <div className="floating-shapes">
        {/* Large Circle */}
        <div className="shape shape-circle shape-1"></div>
        
        {/* Triangle */}
        <div className="shape shape-triangle shape-2"></div>
        
        {/* Square */}
        <div className="shape shape-square shape-3"></div>
        
        {/* Small Circle */}
        <div className="shape shape-circle shape-4"></div>
        
        {/* Diamond */}
        <div className="shape shape-diamond shape-5"></div>
        
        {/* Hexagon */}
        <div className="shape shape-hexagon shape-6"></div>
        
        {/* Rectangle */}
        <div className="shape shape-rectangle shape-7"></div>
        
        {/* Small Triangle */}
        <div className="shape shape-triangle shape-8"></div>
        
        {/* YouTube Play Button */}
        <div className="shape shape-play-button shape-9"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;