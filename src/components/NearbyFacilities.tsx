import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, ArrowRight, ArrowLeft, Pill, Tent, Ambulance } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentLocation, getMedicalFacilities } from '@/utils/locationUtils';
import Map from './Map';
import FirstAidVideos from './FirstAidVideos';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

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
  const [userLocation, setUserLocation] = useState({ latitude: 13.0827, longitude: 80.2707 });
  const [selectedFacility, setSelectedFacility] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    // Use place name and coordinates for more accurate directions
    const destination = encodeURIComponent(facility.name);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${facility.coordinates.latitude},${facility.coordinates.longitude}&destination_place_id=${destination}&travelmode=driving`;
    console.log("Opening directions URL:", url);
    return url;
  };

  const handleCallFacility = (phone: string) => {
    const telUrl = `tel:${phone}`;
    console.log("Initiating call to:", phone);
    window.location.href = telUrl;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Hospital': return Building2;
      case 'Medical Shop': return Pill;
      case 'Medical Tent': return Tent;
      case 'Ambulance': return Ambulance;
      default: return Building2;
    }
  };

  const facilitiesByType = {
    'Hospital': facilities.filter(f => f.type === 'Hospital').slice(0, 25),
    'Medical Shop': facilities.filter(f => f.type === 'Medical Shop').slice(0, 25),
    'Medical Tent': facilities.filter(f => f.type === 'Medical Tent').slice(0, 25),
    'Ambulance': facilities.filter(f => f.type === 'Ambulance').slice(0, 25)
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="bg-primary p-3 text-primary-foreground flex items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-primary-foreground hover:bg-primary-foreground/20">
          <ArrowLeft />
        </Button>
        <h1 className="text-lg sm:text-xl font-bold ml-2 flex-1 text-center">{t('nearby.title')}</h1>
        <LanguageSelector />
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
            <div className="bg-card p-3 rounded-b-xl shadow-sm -mt-1 border border-t-0 border-border">
              <p className="text-sm flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-1 text-emergency" />
                <span>{t('nearby.showing')}</span>
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="Hospital" className="mb-4 sm:mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted">
              <TabsTrigger value="Hospital" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Building2 className="h-4 w-4 mr-1" />
                {t('nearby.hospitals')}
              </TabsTrigger>
              <TabsTrigger value="Medical Shop" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Pill className="h-4 w-4 mr-1" />
                {t('nearby.shops')}
              </TabsTrigger>
              <TabsTrigger value="Medical Tent" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Tent className="h-4 w-4 mr-1" />
                {t('nearby.tents')}
              </TabsTrigger>
              <TabsTrigger value="Ambulance" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Ambulance className="h-4 w-4 mr-1" />
                {t('nearby.ambulance')}
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(facilitiesByType).map(([type, typeFacilities]) => {
              const TypeIcon = getTypeIcon(type);
              return (
                <TabsContent key={type} value={type} className="mt-4">
                  <h2 className="text-lg font-semibold mb-3 flex items-center text-foreground">
                    <TypeIcon size={18} className="mr-2 text-primary" />
                    {t('nearby.' + type.toLowerCase().replace(' ', ''))}s
                  </h2>
                  
                  {loading ? (
                    <div className="flex justify-center p-10">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : typeFacilities.length > 0 ? (
                    <div className="space-y-3">
                      {typeFacilities.map((facility, index) => (
                        <div 
                          key={facility.id} 
                          className={`card-elevated p-3 sm:p-4 cursor-pointer transition-all ${
                            selectedFacility === facility.id 
                              ? 'ring-2 ring-primary border-primary' 
                              : 'hover:border-primary/30'
                          }`}
                          onClick={() => setSelectedFacility(facility.id)}
                        >
                          <div className="flex items-start">
                            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 text-sm font-bold">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{facility.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{facility.address}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2">
                            <span className="text-sm font-medium text-primary">{facility.distance}</span>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex items-center gap-1 flex-1 sm:flex-initial"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCallFacility(facility.phone);
                                }}
                              >
                                <Phone size={14} />
                                <span className="text-xs sm:text-sm">{t('nearby.call')}</span>
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex items-center gap-1 flex-1 sm:flex-initial bg-primary hover:bg-primary/90"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(getDirectionsUrl(facility), '_blank');
                                }}
                              >
                                <ArrowRight size={14} />
                                <span className="text-xs sm:text-sm">{t('nearby.directions')}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-10 card-elevated">
                      <p className="text-muted-foreground">No {type}s {t('nearby.noFacilities')}</p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
          
          <FirstAidVideos />
        </div>
      </div>
    </div>
  );
};

export default NearbyFacilities;
