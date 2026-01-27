
import React from 'react';
import { Link } from 'react-router-dom';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import SMSToSaveButton from '@/components/SMSToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import { Phone, Compass, BarChart3, ChevronRight, Shield, Zap, Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const emergencyContacts = [
    { name: t('contacts.ambulance'), number: "108", icon: Phone, gradient: 'from-red-500 to-rose-600' },
    { name: t('contacts.police'), number: "100", icon: Shield, gradient: 'from-blue-500 to-indigo-600' },
    { name: t('contacts.fire'), number: "101", icon: Zap, gradient: 'from-orange-500 to-amber-600' },
    { name: t('contacts.disaster'), number: "108", icon: Radio, gradient: 'from-purple-500 to-violet-600' },
    { name: t('contacts.women'), number: "1091", icon: Shield, gradient: 'from-pink-500 to-rose-600' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-mesh-cyber bg-orbs">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-4 max-w-md">
        {/* Dashboard Link */}
        <Link to="/dashboard" className="block mb-6 animate-fade-up">
          <div className="group neon-card-hover p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-container-neon">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-neon-pink transition-colors">
                    Monitoring Dashboard
                  </h3>
                  <p className="text-xs text-muted-foreground">Real-time accident statistics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-green/20 border border-neon-green/30">
                  <div className="w-2 h-2 bg-neon-green rounded-full pulse-cyber" />
                  <span className="text-[10px] text-neon-green font-bold uppercase tracking-wider">Live</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </Link>

        {/* Main Actions Card */}
        <div className="neon-card p-6 mb-6 animate-fade-up-delay-1">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-foreground mb-2">
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
        <div className="neon-card p-6 mb-6 animate-fade-up-delay-2">
          <div className="flex items-center gap-4 mb-5">
            <div className="icon-container-cyber">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {t('contacts.title')}
              </h2>
              <p className="text-xs text-muted-foreground">Tap to call instantly</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="group cyber-card p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <contact.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black text-foreground mb-1">{contact.number}</span>
                <span className="text-xs text-muted-foreground group-hover:text-neon-cyan transition-colors">
                  {contact.name}
                </span>
              </a>
            ))}
          </div>
        </div>
        
        {/* About Section */}
        <div className="neon-card p-6 mb-6 animate-fade-up-delay-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-container-purple">
              <Compass className="h-5 w-5 text-white" />
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
      
      <footer className="neon-card border-t border-neon-pink/20 text-foreground p-6 text-center mt-6">
        <p className="text-sm font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
          {t('footer.title')}
        </p>
        <p className="text-xs mt-1 text-muted-foreground">{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default Index;
