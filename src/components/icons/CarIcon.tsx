import React from 'react';

interface CarIconProps {
  className?: string;
}

export const CarIcon: React.FC<CarIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car body */}
      <path d="M4 14h1.5L7 10h10l1.5 4H20c0.55 0 1 0.45 1 1v2c0 0.55-0.45 1-1 1h-1.5c0 1.1-0.9 2-2 2s-2-0.9-2-2h-5c0 1.1-0.9 2-2 2s-2-0.9-2-2H4c-0.55 0-1-0.45-1-1v-2c0-0.55 0.45-1 1-1z" />
      
      {/* Windshield and windows */}
      <path d="M8 10.5L9 8h6l1 2.5v1H8v-1z" fill="white" opacity="0.8" />
      
      {/* Side windows */}
      <rect x="8.5" y="11" width="2" height="1.5" fill="white" opacity="0.6" rx="0.2" />
      <rect x="13.5" y="11" width="2" height="1.5" fill="white" opacity="0.6" rx="0.2" />
      
      {/* Wheels */}
      <circle cx="8" cy="18" r="1.5" fill="currentColor" />
      <circle cx="16" cy="18" r="1.5" fill="currentColor" />
      <circle cx="8" cy="18" r="0.7" fill="white" />
      <circle cx="16" cy="18" r="0.7" fill="white" />
      
      {/* Headlights */}
      <ellipse cx="3.5" cy="12" rx="0.5" ry="0.8" fill="white" opacity="0.9" />
      <ellipse cx="20.5" cy="12" rx="0.5" ry="0.8" fill="white" opacity="0.9" />
      
      {/* Door handle */}
      <circle cx="11" cy="13" r="0.2" fill="currentColor" opacity="0.7" />
    </svg>
  );
};

export default CarIcon;