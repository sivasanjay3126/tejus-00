
import React from 'react';
import { ArrowLeft, BarChart3, Activity, Wifi, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LiveAccidentStats from '@/components/dashboard/LiveAccidentStats';
import LocationAnalysis from '@/components/dashboard/LocationAnalysis';
import TimeAnalysis from '@/components/dashboard/TimeAnalysis';
import SeverityAnalysis from '@/components/dashboard/SeverityAnalysis';
import SystemPerformance from '@/components/dashboard/SystemPerformance';

const Dashboard = () => {
  const regions = ['Salem', 'Erode', 'Namakkal', 'Dharmapuri', 'Coimbatore'];

  return (
    <div className="min-h-screen bg-background text-foreground bg-mesh-cyber bg-orbs">
      {/* Header */}
      <header className="sticky top-0 z-50 neon-card border-b border-neon-pink/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-neon-pink hover:bg-neon-pink/10 rounded-xl transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container-neon">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-black flex items-center gap-2">
                  <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
                    Accident Monitoring
                  </span>
                  <Sparkles className="h-4 w-4 text-neon-cyan animate-pulse" />
                </h1>
                <p className="text-xs text-muted-foreground hidden md:block">Real-time analytics for Tamil Nadu regions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 cyber-card rounded-full">
              <Wifi className="h-3 w-3 text-neon-green" />
              <span className="text-xs text-neon-green font-medium">Connected</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 neon-card rounded-full">
              <div className="w-2 h-2 bg-neon-green rounded-full pulse-cyber" />
              <span className="text-xs text-muted-foreground font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto p-4 lg:p-6">
        {/* Region Tags */}
        <div className="mb-8 animate-fade-up">
          <div className="neon-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-neon-cyan" />
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Monitored Regions
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {regions.map((region, index) => (
                <span 
                  key={region}
                  className="group px-4 py-2.5 cyber-card rounded-xl text-sm font-semibold text-foreground cursor-default transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_20px_hsl(190_90%_50%/0.2)]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple group-hover:from-neon-cyan group-hover:to-neon-green transition-all" />
                    {region}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Accident Stats - Full width */}
          <div className="lg:col-span-2 animate-fade-up-delay-1">
            <LiveAccidentStats />
          </div>

          {/* Location Analysis */}
          <div className="animate-fade-up-delay-2">
            <LocationAnalysis />
          </div>

          {/* Time Analysis */}
          <div className="animate-fade-up-delay-2">
            <TimeAnalysis />
          </div>

          {/* Severity Analysis */}
          <div className="animate-fade-up-delay-3">
            <SeverityAnalysis />
          </div>

          {/* System Performance */}
          <div className="animate-fade-up-delay-3">
            <SystemPerformance />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 neon-card p-5 text-center animate-fade-up-delay-4">
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <Cpu className="h-4 w-4 text-neon-purple" />
            <span>Data updates automatically every 30 seconds</span>
            <span className="text-neon-pink/30">•</span>
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">All statistics reset at midnight daily</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
