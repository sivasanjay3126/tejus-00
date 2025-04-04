
import React from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SnapToSaveButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/camera');
  };

  return (
    <button 
      onClick={handleClick} 
      className="emergency-button w-full mb-3 animate-pulse-emergency"
      aria-label="Snap to Save - Take a photo for emergency"
    >
      <Camera size={28} />
      <span>Snap to Save</span>
    </button>
  );
};

export default SnapToSaveButton;
