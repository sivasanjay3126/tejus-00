import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, MapPin, AlertCircle, Navigation, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DANGEROUS_ROADS, HOTSPOT_COORDINATES, REGIONS_LIST, Region } from '@/utils/dashboardData';
import { generateLocationReport } from '@/utils/pdfGenerator';
import { useFeedback } from '@/contexts/FeedbackContext';

const LocationAnalysis = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('Salem');
  const { triggerFeedback } = useFeedback();

  const handleDownload = () => {
    triggerFeedback('success');
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
    <div className="card-elevated p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="section-header mb-0">
          <div className="icon-container">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="section-title">Location Analysis</h3>
            <p className="section-subtitle">Hotspots & dangerous roads</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2"
        >
          <Download className="h-4 w-4" />
          Report
        </Button>
      </div>

      {/* Region Selector */}
      <div className="mb-6">
        <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as Region)}>
          <SelectTrigger className="w-full card-elevated border-border text-foreground rounded-xl focus:ring-primary/50">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent className="card-elevated border-border">
            {REGIONS_LIST.map(region => (
              <SelectItem 
                key={region} 
                value={region}
                className="text-foreground hover:bg-accent rounded-lg focus:bg-accent"
              >
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hotspots Grid */}
      <div className="card-elevated rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-emergency" />
          <h4 className="text-sm font-semibold text-foreground">Accident Hotspots - {selectedRegion}</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {hotspots.map((spot, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group card-elevated rounded-xl p-4 text-center hover:border-primary/30 transition-all"
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Navigation className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Zone {index + 1}</p>
              <p className="text-xl font-black text-primary">{(spot.intensity * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-muted-foreground">intensity</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dangerous Roads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4 text-warning" />
          <h4 className="text-sm font-semibold text-foreground">Dangerous Roads</h4>
        </div>
        <div className="space-y-3">
          {roads.map((road, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group card-elevated p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {road.name}
                </p>
                <p className="text-xs text-muted-foreground">{road.accidents} accidents this month</p>
              </div>
              <span className={getSeverityStyles(road.severity)}>
                {road.severity}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationAnalysis;
