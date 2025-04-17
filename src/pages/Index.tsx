import React from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import { Phone, MapPin } from 'lucide-react';

const Index = () => {
  const emergencyContacts = [
    { name: "Ambulance", number: "108", },
    { name: "Police", number: "100" },
    { name: "Fire Service", number: "101" },
    { name: "Emergency Disaster", number: "108" },
    { name: "Women Helpline", number: "1091" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-4 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-2">
          <h1 className="text-2xl font-bold text-center text-primary_blue_dark mb-3">
            Emergency Response System
          </h1>
          <p className="text-center mb-6 text-gray-600">
            Quick access to emergency services across India
          </p>
          
          <div className="space-y-4">
            <SnapToSaveButton />
            <GoToSaveButton />
          </div>
        </div>
        
        <div className="info-section">
          <h2 className="section-title">
            <Phone />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="bg-white p-3 rounded-md border border-gray-200 hover:border-primary_blue flex flex-col items-center justify-center transition-colors"
              >
                <span className="font-semibold">{contact.name}</span>
                <span className="text-emergency text-lg font-bold">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="info-section">
          <h2 className="section-title">
            <MapPin />
            About India Medical Services
          </h2>
          <p className="text-sm text-gray-600">
            India district has multiple government and private hospitals equipped
            with emergency services. The TEJUS app helps you locate and connect with
            the nearest medical facilities quickly during emergencies.
          </p>
        </div>
        
        <FirstAidVideos />
      </main>
      
      <footer className="bg-primary_blue_dark text-white p-4 text-center text-sm">
        <p>TEJUS Emergency Alert System</p>
        <p className="text-xs mt-1 text-gray-300">© 2025 All rights reserved</p>
      </footer>
    </div>
  );
};

export default Index;
