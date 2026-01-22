import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Gauge, CheckCircle2, XCircle, Zap, Server } from 'lucide-react';
import { getSystemPerformance, SystemPerformance as SystemPerformanceType } from '@/utils/dashboardData';
import { generateSystemPerformanceReport } from '@/utils/pdfGenerator';

const SystemPerformance = () => {
  const [data, setData] = useState<SystemPerformanceType>(getSystemPerformance());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getSystemPerformance());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    generateSystemPerformanceReport(data);
  };

  const metrics = [
    {
      label: 'Detection Success Rate',
      value: data.detectionSuccessRate.toFixed(1),
      unit: '%',
      target: '95%',
      isMet: data.detectionSuccessRate >= 95,
      progress: data.detectionSuccessRate,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-500/30',
      icon: CheckCircle2
    },
    {
      label: 'False Alert Rate',
      value: data.falseAlertRate.toFixed(1),
      unit: '%',
      target: '< 5%',
      isMet: data.falseAlertRate < 5,
      progress: (5 - data.falseAlertRate) / 5 * 100,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/30',
      icon: data.falseAlertRate < 5 ? CheckCircle2 : XCircle
    },
    {
      label: 'Avg. Notification Time',
      value: data.avgNotificationTime.toFixed(1),
      unit: 's',
      target: '< 30s',
      isMet: data.avgNotificationTime < 30,
      progress: (30 - data.avgNotificationTime) / 30 * 100,
      color: 'from-yellow-500 to-orange-400',
      bgColor: 'from-yellow-500/20 to-yellow-600/10',
      borderColor: 'border-yellow-500/30',
      icon: Zap
    }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 glow-blue">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">System Performance</h3>
            <p className="text-xs text-muted-foreground">Detection & response metrics</p>
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

      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`glass-card p-4 rounded-xl bg-gradient-to-r ${metric.bgColor} border ${metric.borderColor} transition-all duration-300 hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${metric.color}`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {metric.value}<span className="text-sm text-muted-foreground">{metric.unit}</span>
              </span>
            </div>
            <div className="progress-modern">
              <div 
                className={`bar bg-gradient-to-r ${metric.color}`}
                style={{ width: `${Math.max(0, Math.min(100, metric.progress))}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Target: {metric.target}</span>
              <span className={`text-xs font-medium ${metric.isMet ? 'text-green-400' : 'text-red-400'}`}>
                {metric.isMet ? '✓ Target Met' : '✗ Below Target'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 glass-card p-4 rounded-xl bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10 border border-green-500/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Server className="h-5 w-5 text-green-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full pulse-live" />
            </div>
            <div>
              <span className="text-sm font-semibold text-green-400">System Status: Operational</span>
              <p className="text-xs text-muted-foreground">All services running normally</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">99.9%</p>
            <p className="text-[10px] text-muted-foreground">Uptime (30d)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPerformance;
