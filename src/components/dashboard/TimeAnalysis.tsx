import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Clock, TrendingUp, Calendar } from 'lucide-react';
import { getTimeAnalysis, TimeAnalysis as TimeAnalysisType } from '@/utils/dashboardData';
import { generateTimeAnalysisReport } from '@/utils/pdfGenerator';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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

  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
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
          className="glass-card border-white/20 text-foreground hover:bg-white/10 rounded-xl gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Peak Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-red-400" />
            <p className="text-xs font-medium text-muted-foreground">Peak Hours</p>
          </div>
          <div className="space-y-2">
            {peakHours.map((h, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-foreground font-medium">{h.hour}</span>
                <span className="text-sm font-bold text-red-400">{h.accidents}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-orange-400" />
            <p className="text-xs font-medium text-muted-foreground">Peak Days</p>
          </div>
          <div className="space-y-2">
            {peakDays.map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-foreground font-medium">{d.day}</span>
                <span className="text-sm font-bold text-orange-400">{d.accidents}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="glass-card p-4 rounded-xl mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Hourly Distribution</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.byHour}>
              <defs>
                <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="hour" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                interval={3}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                width={25}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="accidents" 
                stroke="#a855f7" 
                strokeWidth={2}
                fill="url(#colorAccidents)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="glass-card p-4 rounded-xl">
        <p className="text-xs font-medium text-muted-foreground mb-3">Weekly Distribution</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byDay} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                width={25}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="accidents" 
                fill="#f97316" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
