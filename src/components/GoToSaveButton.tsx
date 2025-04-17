
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
      className="emergency-button w-full bg-primary_blue hover:bg-primary_blue_dark text-white py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
      aria-label="Go to Save - Find medical facilities across India"
    >
      <MapPin size={28} />
      <span className="text-lg font-medium">Go to Save</span>
    </button>
  );
};

export default GoToSaveButton;
