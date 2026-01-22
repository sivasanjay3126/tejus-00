import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, MapPin, AlertCircle, Navigation } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DANGEROUS_ROADS, HOTSPOT_COORDINATES, REGIONS_LIST, Region } from '@/utils/dashboardData';
import { generateLocationReport } from '@/utils/pdfGenerator';

const LocationAnalysis = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('Salem');

  const handleDownload = () => {
    generateLocationReport();
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const roads = DANGEROUS_ROADS[selectedRegion];
  const hotspots = HOTSPOT_COORDINATES[selectedRegion];

  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 glow-blue">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Location Analysis</h3>
            <p className="text-xs text-muted-foreground">Hotspots & dangerous roads</p>
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

      {/* Region Selector */}
      <div className="mb-6">
        <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as Region)}>
          <SelectTrigger className="w-full glass-card border-white/20 text-foreground rounded-xl">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/20 backdrop-blur-xl">
            {REGIONS_LIST.map(region => (
              <SelectItem 
                key={region} 
                value={region}
                className="text-foreground hover:bg-white/10 rounded-lg focus:bg-white/10"
              >
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hotspots Grid */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <h4 className="text-sm font-semibold text-foreground">Accident Hotspots - {selectedRegion}</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {hotspots.map((spot, index) => (
            <div 
              key={index}
              className="glass-card-hover rounded-xl p-4 text-center relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-20 rounded-xl"
                style={{ 
                  background: `radial-gradient(circle at center, rgba(239, 68, 68, ${spot.intensity}) 0%, transparent 70%)`
                }}
              />
              <div className="relative z-10">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-xs font-medium text-foreground">Zone {index + 1}</p>
                <p className="text-lg font-bold text-red-400">{(spot.intensity * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground">intensity</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dangerous Roads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-orange-400" />
          <h4 className="text-sm font-semibold text-foreground">Dangerous Roads</h4>
        </div>
        <div className="space-y-3">
          {roads.map((road, index) => (
            <div 
              key={index}
              className="glass-card-hover p-4 rounded-xl flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {road.name}
                </p>
                <p className="text-xs text-muted-foreground">{road.accidents} accidents this month</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityStyles(road.severity)}`}>
                {road.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationAnalysis;
