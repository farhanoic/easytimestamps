import React from 'react';
import '../styles/animations.css';

interface ParticleFieldProps {
  className?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating Particles */}
      <div className="particle-field">
        {/* Generate 6 particles (reduced for mobile performance) */}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
};

export default ParticleField;