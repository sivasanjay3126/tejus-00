import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, Bell, Clock, TrendingUp, Activity } from 'lucide-react';
import { getLiveStats, LiveStats, REGIONS_LIST } from '@/utils/dashboardData';
import { generateLiveStatsReport } from '@/utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LiveAccidentStats = () => {
  const [stats, setStats] = useState<LiveStats>(getLiveStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getLiveStats());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const chartData = REGIONS_LIST.map(region => ({
    name: region,
    accidents: stats.byRegion[region]
  }));

  const handleDownload = () => {
    generateLiveStatsReport(stats);
  };

  const statCards = [
    { 
      icon: TrendingUp, 
      value: stats.totalAccidentsToday, 
      label: "Today's Accidents",
      color: 'from-red-500 to-red-600',
      glow: 'glow-red'
    },
    { 
      icon: Activity, 
      value: stats.totalAccidentsMonth, 
      label: 'This Month',
      color: 'from-orange-500 to-orange-600',
      glow: ''
    },
    { 
      icon: Bell, 
      value: stats.alertsSent, 
      label: 'Alerts Sent',
      color: 'from-blue-500 to-blue-600',
      glow: 'glow-blue'
    },
    { 
      icon: Clock, 
      value: stats.avgResponseTime.toFixed(1), 
      label: 'Avg Response (min)',
      color: 'from-green-500 to-green-600',
      glow: 'glow-green'
    }
  ];

  const barColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 glow-red">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Live Accident Stats</h3>
            <p className="text-xs text-muted-foreground">Real-time monitoring across regions</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="glass-card border-white/20 text-foreground hover:bg-white/10 rounded-xl gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`stat-card rounded-xl ${stat.glow}`}
          >
            <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-4 rounded-xl">
        <p className="text-sm font-medium text-muted-foreground mb-4">Accidents by Region</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Bar dataKey="accidents" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveAccidentStats;
