import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmergencyHeader from '@/components/EmergencyHeader';
import SnapToSaveButton from '@/components/SnapToSaveButton';
import GoToSaveButton from '@/components/GoToSaveButton';
import SMSToSaveButton from '@/components/SMSToSaveButton';
import FirstAidVideos from '@/components/FirstAidVideos';
import SpeedMonitor from '@/components/dashboard/SpeedMonitor';
import { Phone, Info, BarChart3, ChevronRight, Shield, Flame, Siren, Heart, Users, Mail, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedback } from '@/contexts/FeedbackContext';

const Index = () => {
  const { t } = useLanguage();
  const { triggerFeedback } = useFeedback();

  const emergencyContacts = [
    { name: t('contacts.ambulance'), number: "108", icon: Heart, color: 'bg-emergency' },
    { name: t('contacts.police'), number: "100", icon: Shield, color: 'bg-primary' },
    { name: t('contacts.fire'), number: "101", icon: Flame, color: 'bg-warning' },
    { name: t('contacts.disaster'), number: "108", icon: Siren, color: 'bg-chart-5' },
    { name: t('contacts.women'), number: "1091", icon: Users, color: 'bg-info' }
  ];

  const handleContactClick = () => {
    triggerFeedback('click');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <EmergencyHeader />
      
      <main className="flex-1 container mx-auto p-4 max-w-md">
        {/* Dashboard Link */}
        <Link to="/dashboard" className="block mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="card-interactive p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-container">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    Monitoring Dashboard
                  </h3>
                  <p className="text-xs text-muted-foreground">Real-time accident statistics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-live">Live</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Speed Monitor - Always On */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SpeedMonitor />
        </motion.div>

        {/* Main Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6 mb-6"
        >
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
        </motion.div>
        
        {/* Emergency Contacts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6 mb-6"
        >
          <div className="section-header">
            <div className="icon-container-emergency">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="section-title">
                {t('contacts.title')}
              </h2>
              <p className="section-subtitle">Tap to call instantly</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <motion.a
                key={index}
                href={`tel:${contact.number}`}
                onClick={handleContactClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group card-elevated p-4 flex flex-col items-center justify-center text-center hover:border-primary/30"
              >
                <div className={`w-14 h-14 rounded-2xl ${contact.color} flex items-center justify-center mb-3 text-white shadow-sm group-hover:scale-105 transition-transform`}>
                  <contact.icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-foreground mb-1">{contact.number}</span>
                <span className="text-xs text-muted-foreground">
                  {contact.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
        
        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6 mb-6"
        >
          <div className="section-header">
            <div className="icon-container" style={{ background: 'hsl(262, 83%, 58%)' }}>
              <Info className="h-5 w-5" />
            </div>
            <h2 className="section-title">
              {t('about.title')}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('about.description')}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FirstAidVideos />
        </motion.div>

        {/* Credits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-elevated p-6 mt-6"
        >
          <div className="text-center space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              This Application is created by Sivasanjay and Team
            </h3>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <a href="tel:+919092023126" className="flex items-center gap-2 hover:text-primary transition-colors">
                <PhoneCall className="h-4 w-4" />
                +91 90920 23126
              </a>
              <a href="mailto:sivasanjayv2004@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                sivasanjayv2004@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </main>
      
      <footer className="card-elevated border-t border-border text-foreground p-6 text-center mt-6">
        <p className="text-sm font-bold text-primary">
          {t('footer.title')}
        </p>
        <p className="text-xs mt-1 text-muted-foreground">{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default Index;
