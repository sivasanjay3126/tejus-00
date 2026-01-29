import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface MapProps {
  latitude: number;
  longitude: number;
  facilities?: Array<{
    id: number;
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
  selectedId?: number;
}

const Map = ({ latitude, longitude, facilities = [], selectedId }: MapProps) => {
  const [mapUrl, setMapUrl] = useState<string>("");
  
  useEffect(() => {
    // Create OpenStreetMap static image URL (free, no API key required)
    const zoom = facilities.length > 0 ? 12 : 14;
    const width = 640;
    const height = 320;
    
    // Use OpenStreetMap static map service
    const osmUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik`;
    
    // Add markers for user location and facilities
    let markersUrl = `&markers=${latitude},${longitude},red-pushpin`;
    
    facilities.slice(0, 10).forEach((facility, index) => {
      const isSelected = facility.id === selectedId;
      const marker = isSelected ? 'green-pushpin' : 'blue-pushpin';
      markersUrl += `|${facility.coordinates.latitude},${facility.coordinates.longitude},${marker}`;
    });
    
    setMapUrl(osmUrl + markersUrl);
    console.log("Map URL created for location:", latitude, longitude);
  }, [latitude, longitude, facilities, selectedId]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/hospitals+near+me/@${latitude},${longitude},14z`;
    window.open(url, '_blank');
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=nearest+hospital&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full h-48 sm:h-64 bg-muted rounded-xl overflow-hidden border border-border">
      {/* Map placeholder with location info */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-info/5 p-4">
        <div className="icon-container mb-4">
          <MapPin className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Medical Facilities Map</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {facilities.length > 0 
            ? `${facilities.length} facilities found near your location`
            : 'Showing your current location'
          }
        </p>
        <div className="flex gap-2">
          <button
            onClick={openInGoogleMaps}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
          >
            <MapPin className="h-4 w-4" />
            View Map
          </button>
          <button
            onClick={openDirections}
            className="flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </button>
        </div>
      </div>
      
      {/* Location badge */}
      <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm text-foreground text-xs px-3 py-1.5 rounded-lg border border-border flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        <span>Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}</span>
      </div>
    </div>
  );
};

export default Map;
