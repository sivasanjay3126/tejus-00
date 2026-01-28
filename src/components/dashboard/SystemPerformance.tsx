import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Gauge, CheckCircle2, XCircle, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSystemPerformance, SystemPerformance as SystemPerformanceType } from '@/utils/dashboardData';
import { generateSystemPerformanceReport } from '@/utils/pdfGenerator';
import { useFeedback } from '@/contexts/FeedbackContext';

const SystemPerformance = () => {
  const [data, setData] = useState<SystemPerformanceType>(getSystemPerformance());
  const { triggerFeedback } = useFeedback();

  useEffect(() => {
    const interval = setInterval(() => setData(getSystemPerformance()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    triggerFeedback('success');
    generateSystemPerformanceReport(data);
  };

  const metrics = [
    { label: 'Detection Success Rate', value: data.detectionSuccessRate.toFixed(1), unit: '%', target: '95%', isMet: data.detectionSuccessRate >= 95, progress: data.detectionSuccessRate, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', barColor: 'bg-success', icon: CheckCircle2 },
    { label: 'False Alert Rate', value: data.falseAlertRate.toFixed(1), unit: '%', target: '< 5%', isMet: data.falseAlertRate < 5, progress: (5 - data.falseAlertRate) / 5 * 100, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', barColor: 'bg-warning', icon: data.falseAlertRate < 5 ? CheckCircle2 : XCircle },
    { label: 'Avg. Notification Time', value: data.avgNotificationTime.toFixed(1), unit: 's', target: '< 30s', isMet: data.avgNotificationTime < 30, progress: (30 - data.avgNotificationTime) / 30 * 100, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', barColor: 'bg-primary', icon: Zap }
  ];

  return (
    <div className="card-elevated p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="section-header mb-0">
          <div className="icon-container-success">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="section-title">System Performance</h3>
            <p className="section-subtitle">Detection & response metrics</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2">
          <Download className="h-4 w-4" />
          Report
        </Button>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${metric.bg} ${metric.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${metric.bg}`}><metric.icon className={`h-4 w-4 ${metric.color}`} /></div>
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
              <span className={`text-2xl font-black ${metric.color}`}>{metric.value}<span className="text-sm text-muted-foreground">{metric.unit}</span></span>
            </div>
            <div className="progress-bar"><div className={`bar ${metric.barColor}`} style={{ width: `${Math.max(0, Math.min(100, metric.progress))}%` }} /></div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Target: {metric.target}</span>
              <span className={`text-xs font-bold ${metric.isMet ? 'text-success' : 'text-emergency'}`}>{metric.isMet ? '✓ Met' : '✗ Below'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-6 p-5 rounded-xl bg-success/10 border border-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative"><Cpu className="h-6 w-6 text-success" /><div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full animate-pulse" /></div>
            <div><span className="text-sm font-bold text-success">System Operational</span><p className="text-xs text-muted-foreground">All services running</p></div>
          </div>
          <div className="text-right"><p className="text-2xl font-black text-foreground">99.9%</p><p className="text-[10px] text-muted-foreground">Uptime</p></div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemPerformance;
