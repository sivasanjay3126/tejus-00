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
        
        // Default to Coimbatore coordinates if location is not available
        const coordinates = {
          latitude: latitude || 11.0168, // Coimbatore latitude
          longitude: longitude || 76.9558, // Coimbatore longitude
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
        toast.error("Unable to retrieve your location. Using default Coimbatore location.");
        
        // Fallback to Coimbatore coordinates
        resolve({
          coordinates: {
            latitude: 11.0168, // Coimbatore latitude
            longitude: 76.9558, // Coimbatore longitude
          },
          formattedAddress: "Coimbatore, Tamil Nadu, India (Default)"
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

// Renamed from getSalemMedicalFacilities to getMedicalFacilities
export const getMedicalFacilities = async (userLocation: Coordinates) => {
  // In a real app, this would fetch from a Google Places/Maps API with the user's location
  
  // Updated mock data for Coimbatore
  const facilities = [
    {
      id: 1,
      name: "Coimbatore Medical College Hospital",
      type: "Hospital",
      address: "Trichy Rd, Near Railway Station, Coimbatore",
      phone: "04222301393",
      distance: calculateDistance(userLocation, { latitude: 11.0160, longitude: 76.9683 }),
      coordinates: {
        latitude: 11.0160,
        longitude: 76.9683
      }
    },
    {
      id: 2,
      name: "PSG Hospitals",
      type: "Hospital",
      address: "Avinashi Road, Peelamedu, Coimbatore",
      phone: "04224345555",
      distance: calculateDistance(userLocation, { latitude: 11.0323, longitude: 77.0338 }),
      coordinates: {
        latitude: 11.0323,
        longitude: 77.0338
      }
    },
    {
      id: 3,
      name: "Kovai Medical Center and Hospital",
      type: "Hospital",
      address: "Avinashi Road, Civil Aerodrome Post, Coimbatore",
      phone: "04224323800",
      distance: calculateDistance(userLocation, { latitude: 11.0340, longitude: 77.0415 }),
      coordinates: {
        latitude: 11.0340,
        longitude: 77.0415
      }
    },
    {
      id: 4,
      name: "Sri Ramakrishna Hospital",
      type: "Hospital",
      address: "395, Sarojini Naidu Rd, New Siddhapudur, Coimbatore",
      phone: "04222395227",
      distance: calculateDistance(userLocation, { latitude: 11.0192, longitude: 76.9966 }),
      coordinates: {
        latitude: 11.0192,
        longitude: 76.9966
      }
    },
    {
      id: 5,
      name: "G Kuppuswamy Naidu Memorial Hospital",
      type: "Hospital",
      address: "P.N. Palayam, Coimbatore",
      phone: "04222227000",
      distance: calculateDistance(userLocation, { latitude: 11.0042, longitude: 76.9724 }),
      coordinates: {
        latitude: 11.0042,
        longitude: 76.9724
      }
    },
    {
      id: 6,
      name: "Apollo Pharmacy",
      type: "Medical Shop",
      address: "DB Road, RS Puram, Coimbatore",
      phone: "04224267888",
      distance: calculateDistance(userLocation, { latitude: 11.0075, longitude: 76.9507 }),
      coordinates: {
        latitude: 11.0075,
        longitude: 76.9507
      }
    },
    {
      id: 7,
      name: "MedPlus Pharmacy",
      type: "Medical Shop",
      address: "Avinashi Road, Coimbatore",
      phone: "04224506070",
      distance: calculateDistance(userLocation, { latitude: 11.0231, longitude: 76.9991 }),
      coordinates: {
        latitude: 11.0231,
        longitude: 76.9991
      }
    },
    {
      id: 8,
      name: "Apollo Medical Center",
      type: "Medical Tent",
      address: "Lakshmi Mills Junction, Coimbatore",
      phone: "04222241333",
      distance: calculateDistance(userLocation, { latitude: 11.0124, longitude: 76.9791 }),
      coordinates: {
        latitude: 11.0124,
        longitude: 76.9791
      }
    },
    {
      id: 9,
      name: "Ganga Hospital",
      type: "Hospital",
      address: "Mettupalayam Rd, Coimbatore",
      phone: "04222485000",
      distance: calculateDistance(userLocation, { latitude: 11.0329, longitude: 76.9476 }),
      coordinates: {
        latitude: 11.0329,
        longitude: 76.9476
      }
    },
    {
      id: 10,
      name: "Royal Care Super Specialty Hospital",
      type: "Hospital",
      address: "Neelambur, Coimbatore",
      phone: "04222627000",
      distance: calculateDistance(userLocation, { latitude: 11.0487, longitude: 77.1015 }),
      coordinates: {
        latitude: 11.0487,
        longitude: 77.1015
      }
    },
    {
      id: 11,
      name: "ESI Hospital",
      type: "Hospital",
      address: "Singanallur, Coimbatore",
      phone: "04222222121",
      distance: calculateDistance(userLocation, { latitude: 11.0127, longitude: 77.0370 }),
      coordinates: {
        latitude: 11.0127,
        longitude: 77.0370
      }
    },
    {
      id: 12,
      name: "KG Hospital",
      type: "Hospital",
      address: "Arulmigu Masani Amman Kovil St, Gopalapuram, Coimbatore",
      phone: "04222210000",
      distance: calculateDistance(userLocation, { latitude: 11.0016, longitude: 76.9672 }),
      coordinates: {
        latitude: 11.0016,
        longitude: 76.9672
      }
    },
    {
      id: 13,
      name: "Karpagam Medical Shop",
      type: "Medical Shop",
      address: "Kamaraj Rd, Coimbatore",
      phone: "04222239876",
      distance: calculateDistance(userLocation, { latitude: 10.9987, longitude: 76.9717 }),
      coordinates: {
        latitude: 10.9987,
        longitude: 76.9717
      }
    },
    {
      id: 14,
      name: "Sri Lakshmi Medical Shop",
      type: "Medical Shop",
      address: "Gandhipuram, Coimbatore",
      phone: "04222434567",
      distance: calculateDistance(userLocation, { latitude: 11.0152, longitude: 76.9567 }),
      coordinates: {
        latitude: 11.0152,
        longitude: 76.9567
      }
    },
    {
      id: 15,
      name: "Gandhipuram Medical Tent",
      type: "Medical Tent",
      address: "100 Feet Road, Gandhipuram, Coimbatore",
      phone: "04222454321",
      distance: calculateDistance(userLocation, { latitude: 11.0175, longitude: 76.9531 }),
      coordinates: {
        latitude: 11.0175,
        longitude: 76.9531
      }
    },
    {
      id: 16,
      name: "RS Puram Medical Tent",
      type: "Medical Tent",
      address: "TV Swamy Road, RS Puram, Coimbatore",
      phone: "04222461234",
      distance: calculateDistance(userLocation, { latitude: 11.0092, longitude: 76.9410 }),
      coordinates: {
        latitude: 11.0092,
        longitude: 76.9410
      }
    },
    {
      id: 17,
      name: "Kumaran Medical Shop",
      type: "Medical Shop",
      address: "Saibaba Colony, Coimbatore",
      phone: "04222452345",
      distance: calculateDistance(userLocation, { latitude: 11.0275, longitude: 76.9310 }),
      coordinates: {
        latitude: 11.0275, 
        longitude: 76.9310
      }
    },
    {
      id: 18,
      name: "Aravind Eye Hospital",
      type: "Hospital",
      address: "Avinashi Road, Civil Aerodrome Post, Coimbatore",
      phone: "04222304141",
      distance: calculateDistance(userLocation, { latitude: 11.0299, longitude: 76.9993 }),
      coordinates: {
        latitude: 11.0299,
        longitude: 76.9993
      }
    },
    {
      id: 19,
      name: "Santhosh Medical Shop",
      type: "Medical Shop",
      address: "Peelamedu, Coimbatore",
      phone: "04222572345",
      distance: calculateDistance(userLocation, { latitude: 11.0197, longitude: 77.0105 }),
      coordinates: {
        latitude: 11.0197,
        longitude: 77.0105
      }
    },
    {
      id: 20,
      name: "Peelamedu Medical Tent",
      type: "Medical Tent",
      address: "Near PSG Tech, Peelamedu, Coimbatore",
      phone: "04222594567",
      distance: calculateDistance(userLocation, { latitude: 11.0290, longitude: 77.0220 }),
      coordinates: {
        latitude: 11.0290,
        longitude: 77.0220
      }
    }
  ];
  
  // Sort facilities by distance
  return facilities.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

// Function to calculate distance between two coordinates in km
function calculateDistance(point1: Coordinates, point2: Coordinates): string {
  // Implementation of Haversine formula to calculate distance between two points
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(point2.latitude - point1.latitude);
  const dLon = deg2rad(point2.longitude - point1.longitude);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(point1.latitude)) * Math.cos(deg2rad(point2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  
  return distance.toFixed(1) + " km";
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
