
import { toast } from "sonner";

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationDetails {
  coordinates: Coordinates;
  formattedAddress?: string;
}

export const getCurrentLocation = (): Promise<LocationDetails> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      reject(new Error("Geolocation is not supported"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Default to Salem coordinates if location is not available
        const coordinates = {
          latitude: latitude || 11.6643, // Salem latitude
          longitude: longitude || 78.1460, // Salem longitude
          accuracy: accuracy
        };
        
        // For a real app, you would reverse geocode here to get the address
        const locationDetails: LocationDetails = {
          coordinates,
          formattedAddress: `Lat: ${coordinates.latitude.toFixed(4)}, Long: ${coordinates.longitude.toFixed(4)}`
        };
        
        resolve(locationDetails);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        toast.error("Unable to retrieve your location. Using default Salem location.");
        
        // Fallback to Salem coordinates
        resolve({
          coordinates: {
            latitude: 11.6643, // Salem latitude
            longitude: 78.1460, // Salem longitude
          },
          formattedAddress: "Salem, Tamil Nadu, India (Default)"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

export const sendEmergencyMessage = async (imageBlob: Blob, locationDetails: LocationDetails): Promise<boolean> => {
  // In a real app, this would connect to an SMS API service
  try {
    // Simulate sending the message
    console.log("Sending emergency message with image and location:", locationDetails);
    toast.success("Emergency alert sent successfully! Help is on the way.");
    
    // For demonstration - showing what would be sent
    // In a real implementation, this would call an API endpoint that sends SMS
    const phoneNumber = "9092023126";
    const messageContent = `EMERGENCY ALERT from location: ${locationDetails.formattedAddress}`;
    
    console.log(`Would send SMS to ${phoneNumber}:`, messageContent);
    console.log("With image attachment:", imageBlob);
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send emergency alert. Please try again or call emergency services directly.");
    return false;
  }
};

// Enhanced data for Salem medical facilities with more accurate coordinates
export const getSalemMedicalFacilities = async (userLocation: Coordinates) => {
  // In a real app, this would fetch from a Google Places/Maps API with the user's location
  
  // Updated mock data for demonstration with more accurate Salem coordinates
  const facilities = [
    {
      id: 1,
      name: "Salem Government Hospital",
      type: "Hospital",
      address: "Fairlands, Salem, Tamil Nadu 636016",
      phone: "04272314000",
      distance: "2.3 km",
      coordinates: {
        latitude: 11.6688,
        longitude: 78.1463
      }
    },
    {
      id: 2,
      name: "Salem GH Medical Store",
      type: "Medical Shop",
      address: "Near Salem GH, Salem",
      phone: "04272314055",
      distance: "2.4 km",
      coordinates: {
        latitude: 11.6690,
        longitude: 78.1465
      }
    },
    {
      id: 3,
      name: "Vinayaka Mission Hospital",
      type: "Hospital",
      address: "NH-47, Sankari Main Road, Salem",
      phone: "04272264999",
      distance: "5.1 km",
      coordinates: {
        latitude: 11.6312,
        longitude: 78.1407
      }
    },
    {
      id: 4,
      name: "Sri Gokulam Hospital",
      type: "Hospital",
      address: "3/60, Meyyanur Road, Salem",
      phone: "04272750500",
      distance: "3.2 km",
      coordinates: {
        latitude: 11.6582,
        longitude: 78.1723
      }
    },
    {
      id: 5,
      name: "Kauvery Hospital",
      type: "Hospital",
      address: "9, Seshapuram, Fairlands, Salem",
      phone: "04272115333",
      distance: "2.8 km",
      coordinates: {
        latitude: 11.6712,
        longitude: 78.1437
      }
    },
    {
      id: 6,
      name: "Apollo Medical Tent",
      type: "Medical Tent",
      address: "Salem Bus Stand Area, Salem",
      phone: "04272300701",
      distance: "1.5 km",
      coordinates: {
        latitude: 11.6573,
        longitude: 78.1519
      }
    },
    {
      id: 7,
      name: "Avinaashi Medical Shop",
      type: "Medical Shop",
      address: "Junction Main Road, Salem",
      phone: "9443217654",
      distance: "0.7 km",
      coordinates: {
        latitude: 11.6621,
        longitude: 78.1490
      }
    }
  ];
  
  return facilities;
};
