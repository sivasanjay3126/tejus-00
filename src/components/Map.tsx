
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapUrl, setMapUrl] = useState<string>("");
  
  useEffect(() => {
    // Create a more reliable static map URL with proper zoom level
    const createMapUrl = () => {
      // Base URL for Google Maps static image - using a more reliable approach
      const zoom = facilities.length > 0 ? 13 : 14; // Adjust zoom based on if we're showing facilities
      let url = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=640x320&scale=2&maptype=roadmap`;
      
      // Add marker for user's location with a distinct color and label
      url += `&markers=color:red|label:U|${latitude},${longitude}`;
      
      // Add markers for facilities with proper labels and colors
      facilities.forEach((facility, index) => {
        const isSelected = facility.id === selectedId;
        const markerColor = isSelected ? 'green' : 'blue';
        const label = String.fromCharCode(65 + index); // A, B, C, etc.
        url += `&markers=color:${markerColor}|label:${label}|${facility.coordinates.latitude},${facility.coordinates.longitude}`;
      });
      
      setMapUrl(url);
    };
    
    createMapUrl();
  }, [latitude, longitude, facilities, selectedId]);

  return (
    <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      {mapUrl ? (
        <img 
          src={mapUrl} 
          alt="Map showing medical facilities" 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Error loading map image");
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-emergency mb-2" />
            <p>Map loading...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded">
        Salem, Tamil Nadu
      </div>
    </div>
  );
};

export default Map;
