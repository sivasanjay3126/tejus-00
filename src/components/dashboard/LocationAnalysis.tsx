
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, MapPin, AlertCircle, Navigation, Target } from 'lucide-react';
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
    <div className="neon-card p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="icon-container-cyber">
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
          className="neon-card border-neon-cyan/30 text-foreground hover:bg-neon-cyan/10 hover:border-neon-cyan/50 rounded-xl gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Region Selector */}
      <div className="mb-6">
        <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as Region)}>
          <SelectTrigger className="w-full cyber-card border-neon-cyan/20 text-foreground rounded-xl focus:ring-neon-cyan/50">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent className="neon-card border-neon-cyan/20 backdrop-blur-xl">
            {REGIONS_LIST.map(region => (
              <SelectItem 
                key={region} 
                value={region}
                className="text-foreground hover:bg-neon-cyan/10 rounded-lg focus:bg-neon-cyan/10"
              >
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hotspots Grid */}
      <div className="cyber-card rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-neon-pink" />
          <h4 className="text-sm font-semibold text-foreground">Accident Hotspots - {selectedRegion}</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {hotspots.map((spot, index) => (
            <div 
              key={index}
              className="group neon-card-hover rounded-xl p-4 text-center relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-30 rounded-xl"
                style={{ 
                  background: `radial-gradient(circle at center, hsl(340 82% 52% / ${spot.intensity}) 0%, transparent 70%)`
                }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Navigation className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-medium text-foreground">Zone {index + 1}</p>
                <p className="text-xl font-black text-neon-pink">{(spot.intensity * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground">intensity</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dangerous Roads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 text-neon-orange" />
          <h4 className="text-sm font-semibold text-foreground">Dangerous Roads</h4>
        </div>
        <div className="space-y-3">
          {roads.map((road, index) => (
            <div 
              key={index}
              className="group cyber-card p-4 rounded-xl flex items-center justify-between transition-all hover:border-neon-cyan/40"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-neon-cyan transition-colors">
                  {road.name}
                </p>
                <p className="text-xs text-muted-foreground">{road.accidents} accidents this month</p>
              </div>
              <span className={getSeverityStyles(road.severity)}>
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
