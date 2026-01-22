import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Gauge, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { getSystemPerformance, SystemPerformance as SystemPerformanceType } from '@/utils/dashboardData';
import { generateSystemPerformanceReport } from '@/utils/pdfGenerator';
import { Progress } from '@/components/ui/progress';

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

  const getStatusIcon = (condition: boolean) => {
    return condition 
      ? <CheckCircle2 className="h-5 w-5 text-green-500" />
      : <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Gauge className="h-5 w-5 text-cyan-500" />
          System Performance
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detection Success Rate */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(data.detectionSuccessRate >= 95)}
              <span className="text-sm text-gray-300">Detection Success Rate</span>
            </div>
            <span className="text-xl font-bold text-white">{data.detectionSuccessRate.toFixed(1)}%</span>
          </div>
          <Progress value={data.detectionSuccessRate} className="h-3" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Target: 95%</span>
            <span className={`text-xs ${data.detectionSuccessRate >= 95 ? 'text-green-400' : 'text-red-400'}`}>
              {data.detectionSuccessRate >= 95 ? 'Target Met ✓' : 'Below Target'}
            </span>
          </div>
        </div>

        {/* False Alert Rate */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(data.falseAlertRate < 5)}
              <span className="text-sm text-gray-300">False Alert Rate</span>
            </div>
            <span className="text-xl font-bold text-white">{data.falseAlertRate.toFixed(1)}%</span>
          </div>
          <Progress value={data.falseAlertRate * 20} className="h-3" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Target: &lt; 5%</span>
            <span className={`text-xs ${data.falseAlertRate < 5 ? 'text-green-400' : 'text-red-400'}`}>
              {data.falseAlertRate < 5 ? 'Within Limit ✓' : 'Above Limit'}
            </span>
          </div>
        </div>

        {/* Notification Time */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-300">Avg. Time to Notify Ambulance</span>
            </div>
            <span className="text-xl font-bold text-white">{data.avgNotificationTime.toFixed(1)}s</span>
          </div>
          <Progress value={(30 - data.avgNotificationTime) / 30 * 100} className="h-3" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">Target: &lt; 30 seconds</span>
            <span className={`text-xs ${data.avgNotificationTime < 30 ? 'text-green-400' : 'text-red-400'}`}>
              {data.avgNotificationTime < 30 ? 'Excellent ✓' : 'Needs Improvement'}
            </span>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 p-4 rounded-lg border border-green-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-400">System Status: Operational</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">All services running normally • Uptime: 99.9%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPerformance;
