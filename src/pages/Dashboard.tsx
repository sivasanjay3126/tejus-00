import React from 'react';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LiveAccidentStats from '@/components/dashboard/LiveAccidentStats';
import LocationAnalysis from '@/components/dashboard/LocationAnalysis';
import TimeAnalysis from '@/components/dashboard/TimeAnalysis';
import SeverityAnalysis from '@/components/dashboard/SeverityAnalysis';
import SystemPerformance from '@/components/dashboard/SystemPerformance';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold">Accident Monitoring Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Live Data</span>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto p-4 lg:p-6">
        {/* Region Summary */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Monitored Regions</h2>
          <div className="flex flex-wrap gap-2">
            {['Salem', 'Erode', 'Namakkal', 'Dharmapuri', 'Coimbatore'].map((region) => (
              <span 
                key={region}
                className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300 border border-gray-600"
              >
                {region}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Accident Stats - Full width on large screens */}
          <div className="lg:col-span-2">
            <LiveAccidentStats />
          </div>

          {/* Location Analysis */}
          <LocationAnalysis />

          {/* Time Analysis */}
          <TimeAnalysis />

          {/* Severity Analysis */}
          <SeverityAnalysis />

          {/* System Performance */}
          <SystemPerformance />
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Data updates automatically every 30 seconds • Last sync: {new Date().toLocaleTimeString()}</p>
          <p className="mt-1">All statistics reset at midnight daily</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
