
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Clock, TrendingUp, Calendar, Sun, Moon } from 'lucide-react';
import { getTimeAnalysis, TimeAnalysis as TimeAnalysisType } from '@/utils/dashboardData';
import { generateTimeAnalysisReport } from '@/utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const TimeAnalysis = () => {
  const [data, setData] = useState<TimeAnalysisType>(getTimeAnalysis());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getTimeAnalysis());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    generateTimeAnalysisReport(data);
  };

  // Find peak hours
  const peakHours = [...data.byHour]
    .filter(h => h.accidents > 0)
    .sort((a, b) => b.accidents - a.accidents)
    .slice(0, 3);

  // Find peak days
  const peakDays = [...data.byDay]
    .filter(d => d.accidents > 0)
    .sort((a, b) => b.accidents - a.accidents)
    .slice(0, 2);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="neon-card p-3 text-sm border-neon-purple/30">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-neon-purple">{payload[0].value} accidents</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neon-card p-6 rounded-3xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="icon-container-purple">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Time Analysis</h3>
            <p className="text-xs text-muted-foreground">Peak accident patterns</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="neon-card border-neon-purple/30 text-foreground hover:bg-neon-purple/10 hover:border-neon-purple/50 rounded-xl gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Peak Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="cyber-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="h-4 w-4 text-neon-pink" />
            <p className="text-xs font-medium text-muted-foreground">Peak Hours</p>
          </div>
          <div className="space-y-2">
            {peakHours.map((h, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-foreground font-medium">{h.hour}</span>
                <span className="text-sm font-bold text-neon-pink">{h.accidents}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cyber-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-neon-cyan" />
            <p className="text-xs font-medium text-muted-foreground">Peak Days</p>
          </div>
          <div className="space-y-2">
            {peakDays.map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-foreground font-medium">{d.day}</span>
                <span className="text-sm font-bold text-neon-cyan">{d.accidents}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="cyber-card p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Moon className="h-4 w-4 text-neon-purple" />
          <p className="text-xs font-medium text-muted-foreground">Hourly Distribution</p>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.byHour}>
              <defs>
                <linearGradient id="colorAccidentsTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280 60% 50%)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(280 60% 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="hour" 
                tick={{ fill: 'hsl(240 10% 60%)', fontSize: 9 }}
                interval={3}
                axisLine={{ stroke: 'hsl(240 15% 20%)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(240 10% 60%)', fontSize: 9 }}
                axisLine={{ stroke: 'hsl(240 15% 20%)' }}
                tickLine={false}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="accidents" 
                stroke="hsl(280 60% 50%)" 
                strokeWidth={2}
                fill="url(#colorAccidentsTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="cyber-card p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-neon-cyan" />
          <p className="text-xs font-medium text-muted-foreground">Weekly Distribution</p>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byDay} barCategoryGap="15%">
              <defs>
                <linearGradient id="barGradientDay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(190 90% 50%)" />
                  <stop offset="100%" stopColor="hsl(280 60% 50%)" />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(240 10% 60%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(240 15% 20%)' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(240 10% 60%)', fontSize: 9 }}
                axisLine={{ stroke: 'hsl(240 15% 20%)' }}
                tickLine={false}
                width={25}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="accidents" 
                fill="url(#barGradientDay)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
