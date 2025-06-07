
import React from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import SMSToSaveButton from '@/components/SMSToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import { Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const emergencyContacts = [
    { name: t('contacts.ambulance'), number: "108" },
    { name: t('contacts.police'), number: "100" },
    { name: t('contacts.fire'), number: "101" },
    { name: t('contacts.disaster'), number: "108" },
    { name: t('contacts.women'), number: "1091" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-4 max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 mt-2 border border-gray-700">
          <h1 className="text-2xl font-bold text-center text-white mb-3">
            {t('main.title')}
          </h1>
          <p className="text-center mb-6 text-gray-300">
            {t('main.subtitle')}
          </p>
          
          <div className="space-y-4">
            <SnapToSaveButton />
            <GoToSaveButton />
            <SMSToSaveButton />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-md p-5 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Phone className="text-primary_blue" />
            {t('contacts.title')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="bg-gray-700 p-3 rounded-md border border-gray-600 hover:border-primary_blue flex flex-col items-center justify-center transition-colors hover:bg-gray-600"
              >
                <span className="font-semibold text-white text-sm">{contact.name}</span>
                <span className="text-emergency text-lg font-bold">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-md p-5 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="text-primary_blue" />
            {t('about.title')}
          </h2>
          <p className="text-sm text-gray-300">
            {t('about.description')}
          </p>
        </div>
        
        <FirstAidVideos />
      </main>
      
      <footer className="bg-gray-800 border-t border-gray-700 text-white p-4 text-center text-sm">
        <p>{t('footer.title')}</p>
        <p className="text-xs mt-1 text-gray-400">{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default Index;
