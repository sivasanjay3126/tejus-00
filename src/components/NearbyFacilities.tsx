
import React, { useEffect, useState } from 'react';
import { Hospital, MapPin, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentLocation, getMedicalFacilities } from '@/utils/locationUtils';
import Map from './Map';
import FirstAidVideos from './FirstAidVideos';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Facility {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string;
  distance: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const NearbyFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState({ latitude: 13.0827, longitude: 80.2707 }); // Default Chennai coordinates
  const [selectedFacility, setSelectedFacility] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("Getting current location...");
        const location = await getCurrentLocation();
        console.log("Location received:", location.coordinates);
        setUserLocation(location.coordinates);
        
        const nearbyFacilities = await getMedicalFacilities(location.coordinates);
        console.log("Facilities loaded:", nearbyFacilities.length);
        setFacilities(nearbyFacilities);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Unable to load nearby facilities. Using default data.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getDirectionsUrl = (facility: Facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${facility.coordinates.latitude},${facility.coordinates.longitude}&travelmode=driving`;
    console.log("Opening directions URL:", url);
    return url;
  };

  const handleCallFacility = (phone: string) => {
    const telUrl = `tel:${phone}`;
    console.log("Initiating call to:", phone);
    window.location.href = telUrl;
  };

  const facilitiesByType = {
    'Hospital': facilities.filter(f => f.type === 'Hospital').slice(0, 25),
    'Medical Shop': facilities.filter(f => f.type === 'Medical Shop').slice(0, 25),
    'Medical Tent': facilities.filter(f => f.type === 'Medical Tent').slice(0, 25),
    'Ambulance': facilities.filter(f => f.type === 'Ambulance').slice(0, 25)
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="bg-primary_blue p-3 text-white flex items-center shadow-lg">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:bg-white/20">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg sm:text-xl font-bold ml-2 flex-1 text-center">TEJUS - Medical Help Across Tamil Nadu</h1>
      </div>
      
      <div className="flex-1 overflow-auto pb-4">
        <div className="container mx-auto p-3 sm:p-4">
          <div className="mb-4 sm:mb-6">
            <Map 
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              facilities={facilities.slice(0, 20)}
              selectedId={selectedFacility}
            />
            <div className="bg-gray-800 p-3 rounded-b-lg shadow-md -mt-1 border-t border-gray-700">
              <p className="text-sm flex items-center text-gray-300">
                <MapPin size={16} className="mr-1 text-emergency" />
                <span>Showing medical facilities across Tamil Nadu</span>
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="Hospital" className="mb-4 sm:mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-800 text-white">
              <TabsTrigger value="Hospital" className="text-xs sm:text-sm data-[state=active]:bg-primary_blue">Hospitals</TabsTrigger>
              <TabsTrigger value="Medical Shop" className="text-xs sm:text-sm data-[state=active]:bg-primary_blue">Shops</TabsTrigger>
              <TabsTrigger value="Medical Tent" className="text-xs sm:text-sm data-[state=active]:bg-primary_blue">Tents</TabsTrigger>
              <TabsTrigger value="Ambulance" className="text-xs sm:text-sm data-[state=active]:bg-primary_blue">Ambulance</TabsTrigger>
            </TabsList>
            
            {Object.entries(facilitiesByType).map(([type, typeFacilities]) => (
              <TabsContent key={type} value={type} className="mt-4">
                <h2 className="text-lg font-semibold mb-3 flex items-center text-white">
                  <Hospital size={18} className="mr-2 text-primary_blue" />
                  Nearby {type}s
                </h2>
                
                {loading ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary_blue border-t-transparent rounded-full"></div>
                  </div>
                ) : typeFacilities.length > 0 ? (
                  <div className="space-y-3">
                    {typeFacilities.map((facility, index) => (
                      <div 
                        key={facility.id} 
                        className={`bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border cursor-pointer transition-all ${
                          selectedFacility === facility.id 
                            ? 'ring-2 ring-primary_blue border-primary_blue' 
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedFacility(facility.id)}
                      >
                        <div className="flex items-start">
                          <div className="bg-primary_blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{facility.name}</h3>
                            <p className="text-sm text-gray-300 line-clamp-2">{facility.address}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2">
                          <span className="text-sm font-medium text-primary_blue">{facility.distance}</span>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 flex-1 sm:flex-initial bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallFacility(facility.phone);
                              }}
                            >
                              <Phone size={14} />
                              <span className="text-xs sm:text-sm">Call</span>
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex items-center gap-1 flex-1 sm:flex-initial bg-primary_blue hover:bg-primary_blue_dark"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getDirectionsUrl(facility), '_blank');
                              }}
                            >
                              <ArrowRight size={14} />
                              <span className="text-xs sm:text-sm">Directions</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No {type}s found nearby</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          
          <FirstAidVideos />
        </div>
      </div>
    </div>
  );
};

export default NearbyFacilities;
