import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Clock } from 'lucide-react';
import { getTimeAnalysis, TimeAnalysis as TimeAnalysisType } from '@/utils/dashboardData';
import { generateTimeAnalysisReport } from '@/utils/pdfGenerator';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimeAnalysis = () => {
  const [data, setData] = useState<TimeAnalysisType>(getTimeAnalysis());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getTimeAnalysis());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    generateTimeAnalysisReport(data);
  };

  // Find peak hours
  const peakHours = [...data.byHour]
    .filter(h => h.accidents > 0)
    .sort((a, b) => b.accidents - a.accidents)
    .slice(0, 3);

  // Find peak days
  const peakDays = [...data.byDay]
    .filter(d => d.accidents > 0)
    .sort((a, b) => b.accidents - a.accidents)
    .slice(0, 2);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          Time Analysis
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
        {/* Peak times summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Peak Accident Hours</p>
            {peakHours.map((h, i) => (
              <div key={i} className="flex justify-between items-center mb-1">
                <span className="text-sm text-white">{h.hour}</span>
                <span className="text-sm text-red-400 font-bold">{h.accidents}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Peak Days</p>
            {peakDays.map((d, i) => (
              <div key={i} className="flex justify-between items-center mb-1">
                <span className="text-sm text-white">{d.day}</span>
                <span className="text-sm text-orange-400 font-bold">{d.accidents}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly chart */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Accidents by Hour of Day</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.byHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  interval={2}
                />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accidents" 
                  stroke="#A855F7" 
                  strokeWidth={2}
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily chart */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Accidents by Day of Week</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="accidents" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeAnalysis;
