
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Gauge, CheckCircle2, XCircle, Zap, Server, Cpu } from 'lucide-react';
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
      gradient: 'from-neon-green to-neon-cyan',
      icon: CheckCircle2
    },
    {
      label: 'False Alert Rate',
      value: data.falseAlertRate.toFixed(1),
      unit: '%',
      target: '< 5%',
      isMet: data.falseAlertRate < 5,
      progress: (5 - data.falseAlertRate) / 5 * 100,
      gradient: 'from-neon-cyan to-neon-purple',
      icon: data.falseAlertRate < 5 ? CheckCircle2 : XCircle
    },
    {
      label: 'Avg. Notification Time',
      value: data.avgNotificationTime.toFixed(1),
      unit: 's',
      target: '< 30s',
      isMet: data.avgNotificationTime < 30,
      progress: (30 - data.avgNotificationTime) / 30 * 100,
      gradient: 'from-neon-purple to-neon-pink',
      icon: Zap
    }
  ];

  return (
    <div className="neon-card p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="icon-container-cyber">
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
          className="neon-card border-neon-cyan/30 text-foreground hover:bg-neon-cyan/10 hover:border-neon-cyan/50 rounded-xl gap-2"
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
            className="cyber-card p-4 rounded-xl transition-all duration-300 hover:border-neon-cyan/40"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${metric.gradient}`}>
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
              <span className="text-2xl font-black text-foreground">
                {metric.value}<span className="text-sm text-muted-foreground">{metric.unit}</span>
              </span>
            </div>
            <div className="progress-neon">
              <div 
                className="bar"
                style={{ 
                  width: `${Math.max(0, Math.min(100, metric.progress))}%`,
                  background: `linear-gradient(135deg, ${metric.gradient.replace('from-', 'hsl(').replace('to-', '), hsl(').replace('neon-green', '160 80% 45%').replace('neon-cyan', '190 90% 50%').replace('neon-purple', '280 60% 50%').replace('neon-pink', '340 82% 52%')})`
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Target: {metric.target}</span>
              <span className={`text-xs font-bold ${metric.isMet ? 'text-neon-green' : 'text-neon-pink'}`}>
                {metric.isMet ? '✓ Target Met' : '✗ Below Target'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 cyber-card p-5 rounded-xl bg-gradient-to-r from-neon-green/10 via-neon-cyan/5 to-transparent border-neon-green/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Cpu className="h-6 w-6 text-neon-green" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full pulse-cyber" />
            </div>
            <div>
              <span className="text-sm font-bold text-neon-green">System Status: Operational</span>
              <p className="text-xs text-muted-foreground">All services running normally</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-foreground">99.9%</p>
            <p className="text-[10px] text-muted-foreground">Uptime (30d)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPerformance;
