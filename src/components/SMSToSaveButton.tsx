
import React from 'react';
import { Send, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const SMSToSaveButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClick = () => {
    navigate('/sms-capture');
  };

  return (
    <button 
      onClick={handleClick} 
      className="group relative w-full overflow-hidden rounded-2xl p-[2px] transition-all duration-300 hover:scale-[1.02]"
      aria-label="SMS to Save - Send emergency SMS with photo offline"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-cyber opacity-75 group-hover:opacity-100 transition-opacity" />
      
      {/* Inner content */}
      <div className="relative flex items-center justify-center gap-4 rounded-2xl bg-background/90 backdrop-blur-sm px-6 py-5 transition-all group-hover:bg-background/80">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-neon-purple/30 blur-lg group-hover:blur-xl transition-all" />
          <div className="relative p-3 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink">
            <Send className="h-7 w-7 text-white" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <span className="text-xl font-bold text-foreground flex items-center gap-2">
            {t('main.smsToSave')}
            <Wifi className="h-4 w-4 text-neon-purple opacity-50" strokeWidth={3} />
          </span>
          <p className="text-sm text-muted-foreground">Works offline too</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-neon-purple/20 flex items-center justify-center group-hover:bg-neon-purple/30 transition-colors">
          <span className="text-neon-purple text-lg">→</span>
        </div>
      </div>
    </button>
  );
};

export default SMSToSaveButton;
