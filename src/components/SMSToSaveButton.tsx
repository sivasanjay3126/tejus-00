import React from 'react';
import { MessageSquare, ArrowRight, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeedback } from '@/contexts/FeedbackContext';

const SMSToSaveButton = () => {
  const navigate = useNavigate();
  const { triggerFeedback } = useFeedback();

  const handleClick = () => {
    triggerFeedback('click');
    navigate('/sms-capture');
  };

  return (
    <motion.button 
      whileHover={{ y: -2, boxShadow: '0 8px 24px hsl(var(--info) / 0.25)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick} 
      className="group w-full card-interactive p-5 flex items-center gap-4 bg-info/5 border-info/20 hover:border-info/40"
      aria-label="SMS to Save - Send emergency SMS offline"
    >
      <div className="icon-container-info">
        <MessageSquare className="h-6 w-6" />
      </div>
      
      <div className="flex-1 text-left">
        <span className="text-lg font-bold text-foreground block flex items-center gap-2">
          SMS to Save
          <WifiOff className="h-4 w-4 text-muted-foreground" />
        </span>
        <p className="text-sm text-muted-foreground">Works offline too</p>
      </div>
      
      <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
        <ArrowRight className="h-5 w-5 text-info group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
};

export default SMSToSaveButton;
