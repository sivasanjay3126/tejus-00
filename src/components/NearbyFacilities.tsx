
import React, { useEffect, useState } from 'react';
import { Hospital, MapPin, Phone, ArrowRight, ArrowLeft, Search, Filter, Clock, Navigation, Building2, Tent, Ambulance } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState({ latitude: 13.0827, longitude: 80.2707 });
  const [selectedFacility, setSelectedFacility] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('Hospital');
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
        setFilteredFacilities(nearbyFacilities);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Unable to load nearby facilities. Using default data.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const filtered = facilities.filter(facility => 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacilities(filtered);
  }, [searchQuery, facilities]);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Hospital':
        return <Hospital className="w-5 h-5" />;
      case 'Medical Shop':
        return <Building2 className="w-5 h-5" />;
      case 'Medical Tent':
        return <Tent className="w-5 h-5" />;
      case 'Ambulance':
        return <Ambulance className="w-5 h-5" />;
      default:
        return <Hospital className="w-5 h-5" />;
    }
  };

  const facilitiesByType = {
    'Hospital': filteredFacilities.filter(f => f.type === 'Hospital'),
    'Medical Shop': filteredFacilities.filter(f => f.type === 'Medical Shop'),
    'Medical Tent': filteredFacilities.filter(f => f.type === 'Medical Tent'),
    'Ambulance': filteredFacilities.filter(f => f.type === 'Ambulance')
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Hospital':
        return 'text-red-400 bg-red-900/20 border-red-700';
      case 'Medical Shop':
        return 'text-green-400 bg-green-900/20 border-green-700';
      case 'Medical Tent':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'Ambulance':
        return 'text-blue-400 bg-blue-900/20 border-blue-700';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-primary p-3 sm:p-4 text-primary-foreground flex items-center shadow-lg border-b border-border">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
          className="text-primary-foreground hover:bg-primary-foreground/20 mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-bold">TEJUS Medical Network</h1>
          <p className="text-xs sm:text-sm opacity-90">Medical Help Across Tamil Nadu</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 sm:p-4 max-w-7xl">
          {/* Map Section */}
          <div className="mb-6">
            <Map 
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              facilities={facilities.slice(0, 20)}
              selectedId={selectedFacility}
            />
            <div className="bg-card p-3 rounded-b-lg shadow-md -mt-1 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm flex items-center text-muted-foreground">
                  <MapPin size={16} className="mr-2 text-emergency" />
                  <span>Showing {facilities.length} medical facilities across Tamil Nadu</span>
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span>Updated real-time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search facilities by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card border border-border">
              <TabsTrigger value="Hospital" className="flex items-center gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Hospital className="w-4 h-4" />
                <span className="hidden sm:inline">Hospitals</span>
                <span className="sm:hidden">H</span>
                <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {facilitiesByType.Hospital.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="Medical Shop" className="flex items-center gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Shops</span>
                <span className="sm:hidden">S</span>
                <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {facilitiesByType['Medical Shop'].length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="Medical Tent" className="flex items-center gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Tent className="w-4 h-4" />
                <span className="hidden sm:inline">Tents</span>
                <span className="sm:hidden">T</span>
                <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {facilitiesByType['Medical Tent'].length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="Ambulance" className="flex items-center gap-1 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Ambulance className="w-4 h-4" />
                <span className="hidden sm:inline">Ambulance</span>
                <span className="sm:hidden">A</span>
                <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {facilitiesByType.Ambulance.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(facilitiesByType).map(([type, typeFacilities]) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center text-foreground">
                    {getTypeIcon(type)}
                    <span className="ml-2">Nearby {type}s</span>
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {typeFacilities.length} found
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Loading nearby facilities...</p>
                  </div>
                ) : typeFacilities.length > 0 ? (
                  <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {typeFacilities.map((facility, index) => (
                      <div 
                        key={facility.id} 
                        className={`bg-card rounded-lg shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md ${
                          selectedFacility === facility.id 
                            ? 'ring-2 ring-primary border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedFacility(facility.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold border ${getTypeColor(facility.type)}`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
                                  {facility.name}
                                </h3>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(facility.type)}`}>
                                  {getTypeIcon(facility.type)}
                                  <span>{facility.type}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {facility.address}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-primary font-medium">
                              <Navigation className="w-4 h-4" />
                              <span className="text-sm">{facility.distance}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {facility.phone}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 flex-1 text-xs"
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
                              className="flex items-center gap-1 flex-1 bg-primary hover:bg-primary/90 text-xs"
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
                  <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getTypeColor(type)}`}>
                      {getTypeIcon(type)}
                    </div>
                    <p className="text-muted-foreground">No {type}s found</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or location</p>
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
