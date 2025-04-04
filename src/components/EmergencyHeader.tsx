
import React from 'react';
import { Ambulance } from 'lucide-react';

const EmergencyHeader = () => {
  return (
    <header className="bg-emergency text-white p-5 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <Ambulance className="h-8 w-8 mr-3 animate-pulse-emergency" />
          <h1 className="text-3xl font-bold tracking-tight">TEJUS</h1>
        </div>
        <p className="text-center mt-1 text-sm md:text-base">Emergency Alert System</p>
      </div>
    </header>
  );
};

export default EmergencyHeader;
