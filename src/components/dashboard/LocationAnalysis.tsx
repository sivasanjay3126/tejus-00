import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DANGEROUS_ROADS, HOTSPOT_COORDINATES, REGIONS_LIST, Region } from '@/utils/dashboardData';
import { generateLocationReport } from '@/utils/pdfGenerator';
import { Badge } from '@/components/ui/badge';

const LocationAnalysis = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('Salem');

  const handleDownload = () => {
    generateLocationReport();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const roads = DANGEROUS_ROADS[selectedRegion];
  const hotspots = HOTSPOT_COORDINATES[selectedRegion];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Location Analysis
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
        <div className="mb-4">
          <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as Region)}>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {REGIONS_LIST.map(region => (
                <SelectItem 
                  key={region} 
                  value={region}
                  className="text-white hover:bg-gray-600"
                >
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hotspots visualization */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Accident Hotspots - {selectedRegion}</h4>
          <div className="grid grid-cols-3 gap-2">
            {hotspots.map((spot, index) => (
              <div 
                key={index}
                className="relative bg-gray-600 rounded-lg p-3 text-center"
                style={{ 
                  boxShadow: `0 0 ${spot.intensity * 20}px ${spot.intensity * 10}px rgba(239, 68, 68, ${spot.intensity * 0.5})` 
                }}
              >
                <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                <p className="text-xs text-gray-300">Hotspot {index + 1}</p>
                <p className="text-xs text-red-400">{(spot.intensity * 100).toFixed(0)}% intensity</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dangerous roads */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Most Dangerous Roads</h4>
          <div className="space-y-2">
            {roads.map((road, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{road.name}</p>
                  <p className="text-xs text-gray-400">{road.accidents} accidents this month</p>
                </div>
                <Badge className={`${getSeverityColor(road.severity)} text-white`}>
                  {road.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationAnalysis;
