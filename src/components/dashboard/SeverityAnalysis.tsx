import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShieldAlert, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSeverityData, SeverityData } from '@/utils/dashboardData';
import { generateSeverityReport } from '@/utils/pdfGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFeedback } from '@/contexts/FeedbackContext';

const COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--emergency))'];

const SeverityAnalysis = () => {
  const [data, setData] = useState<SeverityData>(getSeverityData());
  const { triggerFeedback } = useFeedback();

  useEffect(() => {
    const interval = setInterval(() => setData(getSeverityData()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    triggerFeedback('success');
    generateSeverityReport(data);
  };

  const total = data.minor + data.major + data.critical;
  const chartData = [
    { name: 'Minor', value: data.minor },
    { name: 'Major', value: data.major },
    { name: 'Critical', value: data.critical }
  ];

  const severityCards = [
    { label: 'Minor', value: data.minor, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    { label: 'Major', value: data.major, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    { label: 'Critical', value: data.critical, icon: Zap, color: 'text-emergency', bg: 'bg-emergency/10', border: 'border-emergency/20' }
  ];

  return (
    <div className="card-elevated p-6 rounded-3xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="section-header mb-0">
          <div className="icon-container-emergency">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="section-title">Severity Analysis</h3>
            <p className="section-subtitle">Accident classification</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2">
          <Download className="h-4 w-4" />
          Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card-elevated p-4 rounded-xl flex items-center justify-center">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {chartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3 flex flex-col justify-center">
          {severityCards.map((card, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${card.bg} ${card.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${card.bg}`}><card.icon className={`h-4 w-4 ${card.color}`} /></div>
                  <span className={`text-sm font-semibold ${card.color}`}>{card.label}</span>
                </div>
                <span className={`text-2xl font-black ${card.color}`}>{card.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-6 p-5 rounded-xl bg-success/10 border border-success/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-success/20"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div>
              <span className="text-sm font-medium text-foreground">Critical Cases Rescued</span>
              <p className="text-xs text-muted-foreground">Within 10 minutes</p>
            </div>
          </div>
          <span className="text-3xl font-black text-success">{data.criticalRescuedIn10Min}%</span>
        </div>
        <div className="progress-bar progress-bar-success"><div className="bar" style={{ width: `${data.criticalRescuedIn10Min}%` }} /></div>
      </motion.div>
    </div>
  );
};

export default SeverityAnalysis;
