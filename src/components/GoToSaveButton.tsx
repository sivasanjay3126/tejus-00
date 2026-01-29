import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';

const GoToSaveButton = () => {
  const navigate = useNavigate();
  const { triggerFeedback } = useFeedback();

  const handleClick = () => {
    triggerFeedback('click');
    navigate('/nearby');
  };

  return (
    <motion.button 
      whileHover={{ y: -2, boxShadow: '0 8px 24px hsl(var(--success) / 0.25)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick} 
      className="group w-full card-interactive p-5 flex items-center gap-4 bg-success/5 border-success/20 hover:border-success/40"
      aria-label="Go to Save - Find nearby medical facilities"
    >
      <div className="icon-container-success">
        <MapPin className="h-6 w-6" />
      </div>
      
      <div className="flex-1 text-left">
        <span className="text-lg font-bold text-foreground block">
          Go to Save
        </span>
        <p className="text-sm text-muted-foreground">Find nearby hospitals & clinics</p>
      </div>
      
      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
        <ArrowRight className="h-5 w-5 text-success group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
};

export default GoToSaveButton;
