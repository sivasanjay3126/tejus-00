import React from 'react';
import { ArrowLeft, LayoutDashboard, Activity, Wifi } from 'lucide-react';
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
    <div className="min-h-screen bg-background text-foreground bg-mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary glow-red">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Accident Monitoring Dashboard
                </h1>
                <p className="text-xs text-muted-foreground hidden md:block">Real-time analytics for Tamil Nadu regions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-card rounded-full">
              <Wifi className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Connected</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full pulse-live" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto p-4 lg:p-6">
        {/* Region Tags */}
        <div className="mb-8 animate-fade-up">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Monitored Regions
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region, index) => (
                <span 
                  key={region}
                  className="px-4 py-2 glass-card-hover rounded-full text-sm font-medium text-foreground cursor-default"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500" />
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
        <div className="mt-8 glass-card p-4 rounded-2xl text-center animate-fade-up-delay-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-live" />
            <span>Data updates automatically every 30 seconds</span>
            <span className="text-white/20">•</span>
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">All statistics reset at midnight daily</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
