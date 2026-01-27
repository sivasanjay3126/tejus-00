
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShieldAlert, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';
import { getSeverityData, SeverityData } from '@/utils/dashboardData';
import { generateSeverityReport } from '@/utils/pdfGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['hsl(160 80% 45%)', 'hsl(25 95% 53%)', 'hsl(340 82% 52%)'];

const SeverityAnalysis = () => {
  const [data, setData] = useState<SeverityData>(getSeverityData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getSeverityData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    generateSeverityReport(data);
  };

  const total = data.minor + data.major + data.critical;
  
  const chartData = [
    { name: 'Minor', value: data.minor, color: COLORS[0] },
    { name: 'Major', value: data.major, color: COLORS[1] },
    { name: 'Critical', value: data.critical, color: COLORS[2] }
  ];

  const severityCards = [
    { 
      label: 'Minor', 
      value: data.minor, 
      icon: CheckCircle,
      percentage: ((data.minor / total) * 100).toFixed(1),
      gradient: 'from-neon-green/20 to-neon-green/5',
      borderColor: 'border-neon-green/30',
      textColor: 'text-neon-green',
      iconBg: 'bg-neon-green/20'
    },
    { 
      label: 'Major', 
      value: data.major, 
      icon: AlertTriangle,
      percentage: ((data.major / total) * 100).toFixed(1),
      gradient: 'from-neon-orange/20 to-neon-orange/5',
      borderColor: 'border-neon-orange/30',
      textColor: 'text-neon-orange',
      iconBg: 'bg-neon-orange/20'
    },
    { 
      label: 'Critical', 
      value: data.critical, 
      icon: Zap,
      percentage: ((data.critical / total) * 100).toFixed(1),
      gradient: 'from-neon-pink/20 to-neon-pink/5',
      borderColor: 'border-neon-pink/30',
      textColor: 'text-neon-pink',
      iconBg: 'bg-neon-pink/20'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="neon-card p-3 text-sm border-neon-pink/30">
          <p className="font-bold text-foreground">{payload[0].name}</p>
          <p className="text-neon-pink">{payload[0].value} ({((payload[0].value / total) * 100).toFixed(1)}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neon-card p-6 rounded-3xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-neon-orange to-neon-pink glow-neon-pink">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Severity Analysis</h3>
            <p className="text-xs text-muted-foreground">Accident classification</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="neon-card border-neon-pink/30 text-foreground hover:bg-neon-pink/10 hover:border-neon-pink/50 rounded-xl gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="cyber-card p-4 rounded-xl flex items-center justify-center">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ filter: 'drop-shadow(0 0 10px ' + entry.color + ')' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3 flex flex-col justify-center">
          {severityCards.map((card, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl bg-gradient-to-r ${card.gradient} border ${card.borderColor} transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${card.iconBg}`}>
                    <card.icon className={`h-4 w-4 ${card.textColor}`} />
                  </div>
                  <span className={`text-sm font-semibold ${card.textColor}`}>{card.label}</span>
                </div>
                <span className={`text-2xl font-black ${card.textColor}`}>{card.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 pl-11">{card.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Rescue Metric */}
      <div className="mt-6 cyber-card p-5 rounded-xl bg-gradient-to-r from-neon-green/10 via-neon-cyan/5 to-transparent border-neon-green/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-green/20">
              <CheckCircle className="h-5 w-5 text-neon-green" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Critical Cases Rescued</span>
              <p className="text-xs text-muted-foreground">Within 10 minutes</p>
            </div>
          </div>
          <span className="text-3xl font-black text-neon-green">{data.criticalRescuedIn10Min}%</span>
        </div>
        <div className="progress-neon">
          <div 
            className="bar"
            style={{ 
              width: `${data.criticalRescuedIn10Min}%`,
              background: 'linear-gradient(135deg, hsl(160 80% 45%), hsl(190 90% 50%))'
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Target: 85%</span>
          <span className={`text-xs font-bold ${data.criticalRescuedIn10Min >= 85 ? 'text-neon-green' : 'text-neon-orange'}`}>
            {data.criticalRescuedIn10Min >= 85 ? '✓ On Track' : '⚠ Below Target'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeverityAnalysis;
