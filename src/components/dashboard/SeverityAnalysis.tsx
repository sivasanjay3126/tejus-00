import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ShieldAlert, CheckCircle } from 'lucide-react';
import { getSeverityData, SeverityData } from '@/utils/dashboardData';
import { generateSeverityReport } from '@/utils/pdfGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Progress } from '@/components/ui/progress';

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
    { name: 'Minor', value: data.minor, color: '#22C55E' },
    { name: 'Major', value: data.major, color: '#F97316' },
    { name: 'Critical', value: data.critical, color: '#EF4444' }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-orange-500" />
          Severity Analysis
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
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => <span className="text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-400">Minor</span>
                <span className="text-lg font-bold text-green-400">{data.minor}</span>
              </div>
              <p className="text-xs text-gray-400">{((data.minor / total) * 100).toFixed(1)}% of total</p>
            </div>
            <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-400">Major</span>
                <span className="text-lg font-bold text-orange-400">{data.major}</span>
              </div>
              <p className="text-xs text-gray-400">{((data.major / total) * 100).toFixed(1)}% of total</p>
            </div>
            <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-400">Critical</span>
                <span className="text-lg font-bold text-red-400">{data.critical}</span>
              </div>
              <p className="text-xs text-gray-400">{((data.critical / total) * 100).toFixed(1)}% of total</p>
            </div>
          </div>
        </div>

        {/* Critical rescue metric */}
        <div className="mt-4 bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-300">Critical Cases Rescued within 10 min</span>
            </div>
            <span className="text-lg font-bold text-green-400">{data.criticalRescuedIn10Min}%</span>
          </div>
          <Progress value={data.criticalRescuedIn10Min} className="h-2" />
          <p className="text-xs text-gray-400 mt-2">Target: 85% | Performance: {data.criticalRescuedIn10Min >= 85 ? 'On Track ✓' : 'Below Target'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityAnalysis;
