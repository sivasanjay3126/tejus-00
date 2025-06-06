
import React, { useEffect, useState } from 'react';
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
  const [mapUrl, setMapUrl] = useState<string>("");
  
  useEffect(() => {
    const createMapUrl = () => {
      const zoom = facilities.length > 0 ? 11 : 13;
      let url = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=640x320&scale=2&maptype=roadmap&style=feature:all|element:geometry|color:0x212121&style=feature:all|element:labels.icon|visibility:off&style=feature:all|element:labels.text.fill|color:0x757575&style=feature:all|element:labels.text.stroke|color:0x212121&style=feature:administrative|element:geometry|color:0x757575&style=feature:landscape|element:geometry|color:0x212121&style=feature:poi|element:geometry|color:0x212121&style=feature:road|element:geometry.fill|color:0x2c2c2c&style=feature:road|element:labels.text.fill|color:0x8a8a8a&style=feature:road.arterial|element:geometry|color:0x373737&style=feature:road.highway|element:geometry|color:0x3c3c3c&style=feature:road.highway.controlled_access|element:geometry|color:0x4e4e4e&style=feature:road.local|element:labels.text.fill|color:0x616161&style=feature:transit|element:labels.text.fill|color:0x757575&style=feature:water|element:geometry|color:0x000000`;
      
      // Add marker for user's location
      url += `&markers=color:red|label:U|${latitude},${longitude}`;
      
      // Add markers for facilities
      facilities.slice(0, 20).forEach((facility, index) => {
        const isSelected = facility.id === selectedId;
        const markerColor = isSelected ? 'green' : 'blue';
        const label = String.fromCharCode(65 + index);
        url += `&markers=color:${markerColor}|label:${label}|${facility.coordinates.latitude},${facility.coordinates.longitude}`;
      });
      
      console.log("Map URL created for location:", latitude, longitude);
      setMapUrl(url);
    };
    
    createMapUrl();
  }, [latitude, longitude, facilities, selectedId]);

  return (
    <div className="relative w-full h-48 sm:h-64 bg-gray-800 rounded-lg overflow-hidden">
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
        <div className="flex items-center justify-center h-full bg-gray-800">
          <div className="text-center text-white">
            <MapPin className="mx-auto h-8 w-8 text-emergency mb-2" />
            <p>Map loading...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Tamil Nadu, India
      </div>
    </div>
  );
};

export default Map;
