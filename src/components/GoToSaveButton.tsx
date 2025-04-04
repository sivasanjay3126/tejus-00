
import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GoToSaveButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/nearby');
  };

  return (
    <button 
      onClick={handleClick} 
      className="emergency-button w-full bg-primary_blue hover:bg-primary_blue_dark"
      aria-label="Go to Save - Find nearby medical facilities"
    >
      <MapPin size={28} />
      <span>Go to Save</span>
    </button>
  );
};

export default GoToSaveButton;
