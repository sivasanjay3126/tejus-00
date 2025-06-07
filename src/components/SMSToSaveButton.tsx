
import React from 'react';
import { MessageSquare } from 'lucide-react';
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
      className="emergency-button w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
      aria-label="SMS to Save - Send emergency SMS with photo offline"
    >
      <MessageSquare size={28} />
      <span className="text-lg font-medium">{t('main.smsToSave')}</span>
    </button>
  );
};

export default SMSToSaveButton;
