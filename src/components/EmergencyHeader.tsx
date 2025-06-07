
import React from 'react';
import { Ambulance } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const EmergencyHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-emergency text-white p-5 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            <Ambulance className="h-8 w-8 mr-3 animate-pulse-emergency" />
            <h1 className="text-3xl font-bold tracking-tight">{t('app.title')}</h1>
          </div>
          <LanguageSelector />
        </div>
        <p className="text-center mt-1 text-sm md:text-base">{t('app.subtitle')}</p>
      </div>
    </header>
  );
};

export default EmergencyHeader;
