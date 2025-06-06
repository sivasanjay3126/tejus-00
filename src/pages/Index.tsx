import React from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import SMSToSaveButton from '@/components/SMSToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import { Phone, MapPin } from 'lucide-react';

const Index = () => {
  const emergencyContacts = [
    { name: "Ambulance", number: "108" },
    { name: "Police", number: "100" },
    { name: "Fire Service", number: "101" },
    { name: "Emergency Disaster", number: "108" },
    { name: "Women Helpline", number: "1091" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-4 max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 mt-2 border border-gray-700">
          <h1 className="text-2xl font-bold text-center text-white mb-3">
            Emergency Response System
          </h1>
          <p className="text-center mb-6 text-gray-300">
            Quick access to emergency services across Tamil Nadu
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
            Emergency Contacts
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
            About Tamil Nadu Medical Services
          </h2>
          <p className="text-sm text-gray-300">
            Tamil Nadu has comprehensive government and private hospitals equipped
            with emergency services across all districts. The TEJUS app helps you locate and connect with
            the nearest medical facilities quickly during emergencies.
          </p>
        </div>
        
        <FirstAidVideos />
      </main>
      
      <footer className="bg-gray-800 border-t border-gray-700 text-white p-4 text-center text-sm">
        <p>TEJUS Emergency Alert System</p>
        <p className="text-xs mt-1 text-gray-400">© 2025 All rights reserved</p>
      </footer>
    </div>
  );
};

export default Index;
