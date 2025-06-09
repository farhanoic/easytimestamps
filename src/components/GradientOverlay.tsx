import React from 'react';
import '../styles/animations.css';

interface GradientOverlayProps {
  className?: string;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Animated Gradient Background */}
      <div className="gradient-overlay">
        {/* Primary gradient blob */}
        <div className="gradient-blob gradient-blob-1"></div>
        
        {/* Secondary gradient blob */}
        <div className="gradient-blob gradient-blob-2"></div>
        
        {/* Tertiary gradient blob */}
        <div className="gradient-blob gradient-blob-3"></div>
      </div>
    </div>
  );
};

export default GradientOverlay;