import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Clock, TrendingUp, Calendar, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTimeAnalysis, TimeAnalysis as TimeAnalysisType } from '@/utils/dashboardData';
import { generateTimeAnalysisReport } from '@/utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useFeedback } from '@/contexts/FeedbackContext';

const TimeAnalysis = () => {
  const [data, setData] = useState<TimeAnalysisType>(getTimeAnalysis());
  const { triggerFeedback } = useFeedback();

  useEffect(() => {
    const interval = setInterval(() => setData(getTimeAnalysis()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    triggerFeedback('success');
    generateTimeAnalysisReport(data);
  };

  const peakHours = [...data.byHour].filter(h => h.accidents > 0).sort((a, b) => b.accidents - a.accidents).slice(0, 3);
  const peakDays = [...data.byDay].filter(d => d.accidents > 0).sort((a, b) => b.accidents - a.accidents).slice(0, 2);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-primary">{payload[0].value} accidents</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-elevated p-6 rounded-3xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="section-header mb-0">
          <div className="icon-container-warning">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="section-title">Time Analysis</h3>
            <p className="section-subtitle">Peak accident patterns</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2">
          <Download className="h-4 w-4" />
          Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-elevated p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="h-4 w-4 text-warning" />
            <p className="text-xs font-medium text-muted-foreground">Peak Hours</p>
          </div>
          <div className="space-y-2">
            {peakHours.map((h, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-foreground font-medium">{h.hour}</span>
                <span className="text-sm font-bold text-warning">{h.accidents}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-elevated p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Peak Days</p>
          </div>
          <div className="space-y-2">
            {peakDays.map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-foreground font-medium">{d.day}</span>
                <span className="text-sm font-bold text-primary">{d.accidents}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-elevated p-4 rounded-xl mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Hourly Distribution</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.byHour}>
              <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} interval={3} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="accidents" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary) / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-elevated p-4 rounded-xl">
        <p className="text-xs font-medium text-muted-foreground mb-3">Weekly Distribution</p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byDay} barCategoryGap="15%">
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accidents" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
