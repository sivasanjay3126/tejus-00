import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';

const SnapToSaveButton = () => {
  const navigate = useNavigate();
  const { triggerFeedback } = useFeedback();

  const handleClick = () => {
    triggerFeedback('click');
    navigate('/camera');
  };

  return (
    <motion.button 
      whileHover={{ y: -2, boxShadow: '0 8px 24px hsl(var(--emergency) / 0.25)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick} 
      className="group w-full card-interactive p-5 flex items-center gap-4 bg-emergency/5 border-emergency/20 hover:border-emergency/40"
      aria-label="Snap to Save - Take a photo for emergency"
    >
      <div className="icon-container-emergency">
        <Camera className="h-6 w-6" />
      </div>
      
      <div className="flex-1 text-left">
        <span className="text-lg font-bold text-foreground block">
          Snap to Save
        </span>
        <p className="text-sm text-muted-foreground">Capture & report accidents instantly</p>
      </div>
      
      <div className="w-10 h-10 rounded-full bg-emergency/10 flex items-center justify-center group-hover:bg-emergency/20 transition-colors">
        <ArrowRight className="h-5 w-5 text-emergency group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
};

export default SnapToSaveButton;
