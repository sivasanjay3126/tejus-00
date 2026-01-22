
import React from 'react';
import { Link } from 'react-router-dom';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import SMSToSaveButton from '@/components/SMSToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import { Phone, MapPin, LayoutDashboard, ChevronRight, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { t } = useLanguage();

  const emergencyContacts = [
    { name: t('contacts.ambulance'), number: "108", color: 'from-red-500 to-red-600' },
    { name: t('contacts.police'), number: "100", color: 'from-blue-500 to-blue-600' },
    { name: t('contacts.fire'), number: "101", color: 'from-orange-500 to-orange-600' },
    { name: t('contacts.disaster'), number: "108", color: 'from-purple-500 to-purple-600' },
    { name: t('contacts.women'), number: "1091", color: 'from-pink-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-mesh-gradient">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-4 max-w-md">
        {/* Dashboard Link */}
        <Link to="/dashboard" className="block mb-6 animate-fade-up">
          <div className="glass-card-hover p-4 rounded-2xl group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl gradient-primary glow-red">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Monitoring Dashboard
                  </h3>
                  <p className="text-xs text-muted-foreground">View real-time accident statistics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-live" />
                  <span className="text-[10px] text-green-400 font-medium">LIVE</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </Link>

        {/* Main Actions Card */}
        <div className="glass-card p-6 mb-6 rounded-2xl animate-fade-up-delay-1">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              {t('main.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('main.subtitle')}
            </p>
          </div>
          
          <div className="space-y-4">
            <SnapToSaveButton />
            <GoToSaveButton />
            <SMSToSaveButton />
          </div>
        </div>
        
        {/* Emergency Contacts */}
        <div className="glass-card p-6 mb-6 rounded-2xl animate-fade-up-delay-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 glow-blue">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {t('contacts.title')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="glass-card-hover p-4 rounded-xl flex flex-col items-center justify-center text-center group"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-sm">{contact.number}</span>
                </div>
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                  {contact.name}
                </span>
              </a>
            ))}
          </div>
        </div>
        
        {/* About Section */}
        <div className="glass-card p-6 mb-6 rounded-2xl animate-fade-up-delay-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {t('about.title')}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('about.description')}
          </p>
        </div>
        
        <div className="animate-fade-up-delay-4">
          <FirstAidVideos />
        </div>
      </main>
      
      <footer className="glass-card border-t border-white/10 text-foreground p-6 text-center mt-6">
        <p className="text-sm font-medium">{t('footer.title')}</p>
        <p className="text-xs mt-1 text-muted-foreground">{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default Index;
