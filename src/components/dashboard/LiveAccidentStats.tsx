
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, Bell, Clock, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { getLiveStats, LiveStats, REGIONS_LIST } from '@/utils/dashboardData';
import { generateLiveStatsReport } from '@/utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
      gradient: 'from-neon-pink to-neon-purple',
      glow: 'glow-neon-pink'
    },
    { 
      icon: Activity, 
      value: stats.totalAccidentsMonth, 
      label: 'This Month',
      gradient: 'from-neon-purple to-neon-cyan',
      glow: 'glow-neon-purple'
    },
    { 
      icon: Bell, 
      value: stats.alertsSent, 
      label: 'Alerts Sent',
      gradient: 'from-neon-cyan to-neon-green',
      glow: 'glow-neon-cyan'
    },
    { 
      icon: Clock, 
      value: stats.avgResponseTime.toFixed(1), 
      label: 'Avg Response (min)',
      gradient: 'from-neon-green to-neon-cyan',
      glow: ''
    }
  ];

  const barColors = [
    'hsl(340 82% 52%)',  // neon-pink
    'hsl(280 60% 50%)',  // neon-purple
    'hsl(190 90% 50%)',  // neon-cyan
    'hsl(160 80% 45%)',  // neon-green
    'hsl(25 95% 53%)'    // neon-orange
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="neon-card p-3 text-sm border-neon-pink/30">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-neon-pink">{payload[0].value} accidents</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neon-card p-6 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="icon-container-neon animate-glow-pulse">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground flex items-center gap-2">
              Live Accident Stats
              <Sparkles className="h-4 w-4 text-neon-cyan animate-pulse" />
            </h3>
            <p className="text-xs text-muted-foreground">Real-time monitoring across regions</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="neon-card border-neon-pink/30 text-foreground hover:bg-neon-pink/10 hover:border-neon-pink/50 rounded-xl gap-2 transition-all"
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
            className={`group neon-card-hover p-5 rounded-2xl text-center ${stat.glow}`}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="cyber-card p-5 rounded-2xl">
        <p className="text-sm font-semibold text-muted-foreground mb-4">Accidents by Region</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <defs>
                {barColors.map((color, index) => (
                  <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(240 10% 60%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(240 15% 20%)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(240 10% 60%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(240 15% 20%)' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accidents" radius={[10, 10, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#barGradient${index})`}
                    style={{ filter: `drop-shadow(0 0 8px ${barColors[index]}40)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live indicator */}
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-neon-green pulse-cyber" />
        <span>Updating in real-time</span>
      </div>
    </div>
  );
};

export default LiveAccidentStats;
