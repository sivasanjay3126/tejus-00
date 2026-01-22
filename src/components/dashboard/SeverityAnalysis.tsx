import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShieldAlert, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getSeverityData, SeverityData } from '@/utils/dashboardData';
import { generateSeverityReport } from '@/utils/pdfGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
    { name: 'Minor', value: data.minor, color: '#22c55e' },
    { name: 'Major', value: data.major, color: '#f97316' },
    { name: 'Critical', value: data.critical, color: '#ef4444' }
  ];

  const severityCards = [
    { 
      label: 'Minor', 
      value: data.minor, 
      icon: CheckCircle,
      percentage: ((data.minor / total) * 100).toFixed(1),
      color: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    { 
      label: 'Major', 
      value: data.major, 
      icon: AlertTriangle,
      percentage: ((data.major / total) * 100).toFixed(1),
      color: 'from-orange-500/20 to-orange-600/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      iconBg: 'bg-orange-500/20'
    },
    { 
      label: 'Critical', 
      value: data.critical, 
      icon: XCircle,
      percentage: ((data.critical / total) * 100).toFixed(1),
      color: 'from-red-500/20 to-red-600/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      iconBg: 'bg-red-500/20'
    }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
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
          className="glass-card border-white/20 text-foreground hover:bg-white/10 rounded-xl gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="glass-card p-4 rounded-xl flex items-center justify-center">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ filter: 'drop-shadow(0 0 8px ' + entry.color + '40)' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3">
          {severityCards.map((card, index) => (
            <div 
              key={index}
              className={`p-3 rounded-xl bg-gradient-to-r ${card.color} border ${card.borderColor} transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
                    <card.icon className={`h-4 w-4 ${card.textColor}`} />
                  </div>
                  <span className={`text-sm font-medium ${card.textColor}`}>{card.label}</span>
                </div>
                <span className={`text-xl font-bold ${card.textColor}`}>{card.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 pl-9">{card.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Rescue Metric */}
      <div className="mt-6 glass-card p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-foreground">Critical Cases Rescued within 10 min</span>
          </div>
          <span className="text-2xl font-bold text-green-400">{data.criticalRescuedIn10Min}%</span>
        </div>
        <div className="progress-modern">
          <div 
            className="bar bg-gradient-to-r from-green-500 to-emerald-400"
            style={{ width: `${data.criticalRescuedIn10Min}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Target: 85%</span>
          <span className={`text-xs font-medium ${data.criticalRescuedIn10Min >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
            {data.criticalRescuedIn10Min >= 85 ? '✓ On Track' : '⚠ Below Target'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeverityAnalysis;
