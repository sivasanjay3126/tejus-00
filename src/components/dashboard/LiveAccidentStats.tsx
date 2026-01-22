import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, Bell, Clock, TrendingUp } from 'lucide-react';
import { getLiveStats, LiveStats, REGIONS_LIST } from '@/utils/dashboardData';
import { generateLiveStatsReport } from '@/utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LiveAccidentStats = () => {
  const [stats, setStats] = useState<LiveStats>(getLiveStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getLiveStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = REGIONS_LIST.map(region => ({
    name: region,
    accidents: stats.byRegion[region]
  }));

  const handleDownload = () => {
    generateLiveStatsReport(stats);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Live Accident Stats
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <TrendingUp className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalAccidentsToday}</p>
            <p className="text-xs text-gray-400">Today's Accidents</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <TrendingUp className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalAccidentsMonth}</p>
            <p className="text-xs text-gray-400">This Month</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <Bell className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.alertsSent}</p>
            <p className="text-xs text-gray-400">Alerts Sent</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.avgResponseTime.toFixed(1)}</p>
            <p className="text-xs text-gray-400">Avg Response (min)</p>
          </div>
        </div>

        <div className="h-64">
          <p className="text-sm text-gray-400 mb-2">Accidents by Region</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="accidents" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveAccidentStats;
