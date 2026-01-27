
import React from 'react';
import { Navigation, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const GoToSaveButton = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClick = () => {
    navigate('/nearby');
  };

  return (
    <button 
      onClick={handleClick} 
      className="group relative w-full overflow-hidden rounded-2xl p-[2px] transition-all duration-300 hover:scale-[1.02]"
      aria-label="Go to Save - Find medical facilities across India"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-electric opacity-75 group-hover:opacity-100 transition-opacity" />
      
      {/* Inner content */}
      <div className="relative flex items-center justify-center gap-4 rounded-2xl bg-background/90 backdrop-blur-sm px-6 py-5 transition-all group-hover:bg-background/80">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-neon-cyan/30 blur-lg group-hover:blur-xl transition-all" />
          <div className="relative p-3 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green">
            <Navigation className="h-7 w-7 text-white" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <span className="text-xl font-bold text-foreground flex items-center gap-2">
            {t('main.goToSave')}
            <Locate className="h-4 w-4 text-neon-cyan animate-pulse" />
          </span>
          <p className="text-sm text-muted-foreground">Find nearby hospitals</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-neon-cyan/20 flex items-center justify-center group-hover:bg-neon-cyan/30 transition-colors">
          <span className="text-neon-cyan text-lg">→</span>
        </div>
      </div>
    </button>
  );
};

export default GoToSaveButton;
