import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, Bell, Clock, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLiveStats, LiveStats, REGIONS_LIST } from '@/utils/dashboardData';
import { generateLiveStatsReport } from '@/utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFeedback } from '@/contexts/FeedbackContext';

const LiveAccidentStats = () => {
  const [stats, setStats] = useState<LiveStats>(getLiveStats());
  const { triggerFeedback } = useFeedback();

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
    triggerFeedback('success');
    generateLiveStatsReport(stats);
  };

  const statCards = [
    { 
      icon: TrendingUp, 
      value: stats.totalAccidentsToday, 
      label: "Today's Accidents",
      color: 'text-emergency',
      bg: 'bg-emergency/10',
      border: 'border-emergency/20'
    },
    { 
      icon: Activity, 
      value: stats.totalAccidentsMonth, 
      label: 'This Month',
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20'
    },
    { 
      icon: Bell, 
      value: stats.alertsSent, 
      label: 'Alerts Sent',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20'
    },
    { 
      icon: Clock, 
      value: stats.avgResponseTime.toFixed(1), 
      label: 'Avg Response (min)',
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20'
    }
  ];

  const barColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

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
    <div className="card-elevated p-6 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="section-header mb-0">
          <div className="icon-container-emergency">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h3 className="section-title">Live Accident Stats</h3>
            <p className="section-subtitle">Real-time monitoring across regions</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2 transition-all"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-2xl text-center border ${stat.bg} ${stat.border} hover:shadow-md transition-shadow`}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="card-elevated p-5 rounded-2xl">
        <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Accidents by Region</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accidents" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live indicator */}
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span>Updating in real-time</span>
      </div>
    </div>
  );
};

export default LiveAccidentStats;
