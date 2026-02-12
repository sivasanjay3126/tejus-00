import React from 'react';
import { ArrowLeft, BarChart3, Activity, Wifi, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AudioToggle } from '@/components/ui/AudioToggle';
import LiveAccidentStats from '@/components/dashboard/LiveAccidentStats';
import LocationAnalysis from '@/components/dashboard/LocationAnalysis';
import TimeAnalysis from '@/components/dashboard/TimeAnalysis';
import SeverityAnalysis from '@/components/dashboard/SeverityAnalysis';
import SystemPerformance from '@/components/dashboard/SystemPerformance';
import SpeedMonitor from '@/components/dashboard/SpeedMonitor';

const Dashboard = () => {
  const regions = ['Salem', 'Erode', 'Namakkal', 'Dharmapuri', 'Coimbatore'];

  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-black text-foreground">
                  Accident Monitoring
                </h1>
                <p className="text-xs text-muted-foreground hidden md:block">Real-time analytics for Tamil Nadu regions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-full">
              <Wifi className="h-3 w-3 text-success" />
              <span className="text-xs text-success font-medium">Connected</span>
            </div>
            <span className="badge-live">Live</span>
            <ThemeToggle />
            <AudioToggle />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto p-4 lg:p-6">
        {/* Region Tags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Monitored Regions
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {regions.map((region, index) => (
                <motion.span 
                  key={region}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="region-tag"
                >
                  <span className="indicator" />
                  {region}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Speed Monitor - Full width, above grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <SpeedMonitor />
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Accident Stats - Full width */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <LiveAccidentStats />
          </motion.div>

          {/* Location Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LocationAnalysis />
          </motion.div>

          {/* Time Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TimeAnalysis />
          </motion.div>

          {/* Severity Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SeverityAnalysis />
          </motion.div>

          {/* System Performance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SystemPerformance />
          </motion.div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 card-elevated p-5 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <Cpu className="h-4 w-4 text-primary" />
            <span>Data updates automatically every 30 seconds</span>
            <span className="text-border">•</span>
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">All statistics reset at midnight daily</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
