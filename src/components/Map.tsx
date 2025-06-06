
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
  const [mapError, setMapError] = useState<boolean>(false);
  
  useEffect(() => {
    const createMapUrl = () => {
      try {
        const zoom = facilities.length > 0 ? 11 : 13;
        // Using a working Google Maps Static API URL with proper formatting
        let url = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=640x320&maptype=roadmap&format=png`;
        
        // Add user location marker
        url += `&markers=color:red|label:You|${latitude},${longitude}`;
        
        // Add markers for facilities (limit to 20 to avoid URL length issues)
        facilities.slice(0, 20).forEach((facility, index) => {
          const isSelected = facility.id === selectedId;
          const markerColor = isSelected ? 'green' : 'blue';
          const label = String.fromCharCode(65 + index);
          url += `&markers=color:${markerColor}|label:${label}|${facility.coordinates.latitude},${facility.coordinates.longitude}`;
        });
        
        console.log("Map URL created for location:", latitude, longitude);
        setMapUrl(url);
        setMapError(false);
      } catch (error) {
        console.error("Error creating map URL:", error);
        setMapError(true);
      }
    };
    
    createMapUrl();
  }, [latitude, longitude, facilities, selectedId]);

  const handleMapError = () => {
    console.error("Error loading map image");
    setMapError(true);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/@${latitude},${longitude},13z`;
    window.open(url, '_blank');
  };

  if (mapError) {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white p-4">
          <MapPin className="mx-auto h-12 w-12 text-primary_blue mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map View</h3>
          <p className="text-sm text-gray-300 text-center mb-4">
            Showing medical facilities in Tamil Nadu
          </p>
          <button
            onClick={openInGoogleMaps}
            className="bg-primary_blue hover:bg-primary_blue_dark text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Open in Google Maps
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Tamil Nadu, India
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 sm:h-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      {mapUrl ? (
        <div className="relative w-full h-full">
          <img 
            src={mapUrl} 
            alt="Map showing medical facilities in Tamil Nadu" 
            className="w-full h-full object-cover cursor-pointer"
            onError={handleMapError}
            onClick={openInGoogleMaps}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <button
            onClick={openInGoogleMaps}
            className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition-colors"
          >
            View Full Map
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-800">
          <div className="text-center text-white">
            <div className="animate-spin h-8 w-8 border-4 border-primary_blue border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading map...</p>
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
