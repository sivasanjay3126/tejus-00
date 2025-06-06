
import React from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import { Phone, MapPin, Shield, Heart, Clock, Users } from 'lucide-react';

const Index = () => {
  const emergencyContacts = [
    { name: "Ambulance", number: "108", icon: "🚑" },
    { name: "Police", number: "100", icon: "👮" },
    { name: "Fire Service", number: "101", icon: "🚒" },
    { name: "Emergency Disaster", number: "108", icon: "⚠️" },
    { name: "Women Helpline", number: "1091", icon: "👩" }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "24/7 Emergency Response",
      description: "Round-the-clock emergency services across Tamil Nadu"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Medical Network",
      description: "Access to 1000+ hospitals and medical facilities"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Response",
      description: "Average response time under 15 minutes"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Support",
      description: "Connected network of trained first-aid responders"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-3 sm:p-4 max-w-4xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-xl shadow-lg p-6 sm:p-8 mb-6 border border-border">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Emergency Response System
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Quick access to emergency services across Tamil Nadu
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-3 bg-background/50 rounded-lg border border-border">
                  <div className="text-primary mb-2 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <SnapToSaveButton />
            <GoToSaveButton />
          </div>
        </div>
        
        {/* Emergency Contacts Section */}
        <div className="bg-card rounded-xl shadow-md p-5 sm:p-6 mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <div className="bg-emergency/20 p-2 rounded-lg">
              <Phone className="text-emergency w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            Emergency Contacts
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tap to call emergency services instantly
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="bg-background border border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 flex items-center gap-3 transition-all duration-200 group"
              >
                <div className="text-2xl">{contact.icon}</div>
                <div className="flex-1">
                  <span className="font-semibold text-foreground text-sm sm:text-base block">
                    {contact.name}
                  </span>
                  <span className="text-emergency text-lg sm:text-xl font-bold group-hover:text-emergency">
                    {contact.number}
                  </span>
                </div>
                <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-card rounded-xl shadow-md p-5 sm:p-6 mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <MapPin className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            About Tamil Nadu Medical Services
          </h2>
          <div className="prose prose-sm sm:prose-base text-muted-foreground">
            <p className="mb-4">
              Tamil Nadu has a comprehensive network of government and private hospitals equipped
              with state-of-the-art emergency services across all districts.
            </p>
            <p className="mb-4">
              The TEJUS app connects you with the nearest medical facilities, ambulance services,
              and emergency responders quickly during critical situations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-background/50 rounded-lg">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary">1000+</div>
                <div className="text-xs text-muted-foreground">Medical Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary">32</div>
                <div className="text-xs text-muted-foreground">Districts Covered</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">Emergency Support</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary">15min</div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </div>
        </div>
        
        <FirstAidVideos />
      </main>
      
      <footer className="bg-card border-t border-border text-foreground p-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <p className="font-semibold">TEJUS Emergency Alert System</p>
          <p className="text-xs mt-1 text-muted-foreground">
            © 2025 All rights reserved • Serving Tamil Nadu with care
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Emergency: 108</span>
            <span>•</span>
            <span>Police: 100</span>
            <span>•</span>
            <span>Fire: 101</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
