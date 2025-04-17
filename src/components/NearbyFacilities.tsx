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
  const [userLocation, setUserLocation] = useState({ latitude: 11.0168, longitude: 76.9558 }); // Default Coimbatore coordinates
  const [selectedFacility, setSelectedFacility] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const location = await getCurrentLocation();
        setUserLocation(location.coordinates);
        
        const nearbyFacilities = await getMedicalFacilities(location.coordinates);
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
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${facility.coordinates.latitude},${facility.coordinates.longitude}&travelmode=driving`;
  };

  const handleCallFacility = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const facilitiesByType = {
    'Hospital': facilities.filter(f => f.type === 'Hospital').slice(0, 20),
    'Medical Shop': facilities.filter(f => f.type === 'Medical Shop').slice(0, 20),
    'Medical Tent': facilities.filter(f => f.type === 'Medical Tent').slice(0, 20)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary_blue p-3 text-white flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold ml-2 flex-1 text-center">TEJUS - Medical Help Across India</h1>
      </div>
      
      <div className="container mx-auto p-4 flex-1 overflow-auto pb-16">
        <div className="mb-5">
          <Map 
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            facilities={facilities.slice(0, 20)}
            selectedId={selectedFacility}
          />
          <div className="bg-white p-3 rounded-b-lg shadow-md -mt-1 border-t border-gray-200">
            <p className="text-sm flex items-center">
              <MapPin size={16} className="mr-1 text-emergency" />
              <span>Showing medical facilities across India</span>
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="Hospital" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Hospital">Hospitals</TabsTrigger>
            <TabsTrigger value="Medical Shop">Medical Shops</TabsTrigger>
            <TabsTrigger value="Medical Tent">Medical Tents</TabsTrigger>
          </TabsList>
          
          {Object.entries(facilitiesByType).map(([type, typeFacilities]) => (
            <TabsContent key={type} value={type} className="mt-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
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
                      className={`bg-white rounded-lg shadow-sm p-4 border ${selectedFacility === facility.id ? 'ring-2 ring-primary_blue' : 'border-gray-200'}`}
                      onClick={() => setSelectedFacility(facility.id)}
                    >
                      <div className="flex items-start">
                        <div className="bg-primary_blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{facility.name}</h3>
                          <p className="text-sm text-gray-600">{facility.address}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-primary_blue">{facility.distance}</span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallFacility(facility.phone);
                            }}
                          >
                            <Phone size={14} />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex items-center gap-1 bg-primary_blue hover:bg-primary_blue_dark"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(getDirectionsUrl(facility), '_blank');
                            }}
                          >
                            <ArrowRight size={14} />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                  <p>No {type}s found nearby</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <FirstAidVideos />
        
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default NearbyFacilities;
