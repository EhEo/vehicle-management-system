import React from 'react';

interface VanIconProps {
  className?: string;
}

export const VanIcon: React.FC<VanIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Van body */}
      <path d="M3 12h1.5L6 8h12l1.5 4H21c0.55 0 1 0.45 1 1v3c0 0.55-0.45 1-1 1h-1.5c0 1.1-0.9 2-2 2s-2-0.9-2-2H9.5c0 1.1-0.9 2-2 2s-2-0.9-2-2H3c-0.55 0-1-0.45-1-1v-3c0-0.55 0.45-1 1-1z" />
      
      {/* Windows */}
      <rect x="7" y="9" width="3" height="2" fill="white" opacity="0.8" rx="0.3" />
      <rect x="11" y="9" width="3" height="2" fill="white" opacity="0.8" rx="0.3" />
      <rect x="15" y="9" width="2" height="2" fill="white" opacity="0.8" rx="0.3" />
      
      {/* Wheels */}
      <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7.5" cy="17" r="0.7" fill="white" />
      <circle cx="16.5" cy="17" r="0.7" fill="white" />
      
      {/* Front grille */}
      <rect x="2.5" y="10" width="1" height="2" fill="currentColor" opacity="0.6" />
      
      {/* Side door handle */}
      <circle cx="13" cy="12.5" r="0.3" fill="currentColor" opacity="0.7" />
    </svg>
  );
};

export default VanIcon;