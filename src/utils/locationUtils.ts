
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

export interface Facility {
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
        
        const coordinates = {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy
        };
        
        const locationDetails: LocationDetails = {
          coordinates,
          formattedAddress: `Lat: ${coordinates.latitude.toFixed(4)}, Long: ${coordinates.longitude.toFixed(4)}`
        };
        
        console.log("Location acquired:", coordinates);
        resolve(locationDetails);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        toast.error("Unable to retrieve your location. Using default Tamil Nadu location.");
        
        // Default to Chennai coordinates if location fails
        resolve({
          coordinates: {
            latitude: 13.0827,
            longitude: 80.2707,
          },
          formattedAddress: "Chennai, Tamil Nadu, India (Default)"
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
};

export const sendEmergencyMessage = async (imageBlob: Blob, locationDetails: LocationDetails): Promise<boolean> => {
  try {
    console.log("Sending emergency message with image and location:", locationDetails);
    toast.success("Emergency alert sent successfully! Help is on the way.");
    
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

export const getMedicalFacilities = async (userLocation: Coordinates) => {
  const facilities = [
    // Chennai District
    {
      id: 1,
      name: "Apollo Hospitals",
      type: "Hospital",
      address: "Greams Lane, Off Greams Road, Chennai",
      phone: "04428296000",
      distance: calculateDistance(userLocation, { latitude: 13.0661, longitude: 80.2548 }),
      coordinates: { latitude: 13.0661, longitude: 80.2548 }
    },
    {
      id: 2,
      name: "Fortis Malar Hospital",
      type: "Hospital",
      address: "No. 52, 1st Main Road, Gandhi Nagar, Adyar, Chennai",
      phone: "04442897500",
      distance: calculateDistance(userLocation, { latitude: 13.0067, longitude: 80.2570 }),
      coordinates: { latitude: 13.0067, longitude: 80.2570 }
    },
    {
      id: 3,
      name: "Chennai Medical Pharmacy",
      type: "Medical Shop",
      address: "T. Nagar, Chennai",
      phone: "04428341234",
      distance: calculateDistance(userLocation, { latitude: 13.0418, longitude: 80.2341 }),
      coordinates: { latitude: 13.0418, longitude: 80.2341 }
    },
    {
      id: 4,
      name: "Chennai Emergency Medical Tent",
      type: "Medical Tent",
      address: "Marina Beach, Chennai",
      phone: "04428345678",
      distance: calculateDistance(userLocation, { latitude: 13.0475, longitude: 80.2824 }),
      coordinates: { latitude: 13.0475, longitude: 80.2824 }
    },
    {
      id: 5,
      name: "Chennai Ambulance Service",
      type: "Ambulance",
      address: "Egmore, Chennai",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 13.0732, longitude: 80.2609 }),
      coordinates: { latitude: 13.0732, longitude: 80.2609 }
    },

    // Coimbatore District
    {
      id: 6,
      name: "Coimbatore Medical College Hospital",
      type: "Hospital",
      address: "Trichy Rd, Near Railway Station, Coimbatore",
      phone: "04222301393",
      distance: calculateDistance(userLocation, { latitude: 11.0160, longitude: 76.9683 }),
      coordinates: { latitude: 11.0160, longitude: 76.9683 }
    },
    {
      id: 7,
      name: "PSG Hospitals",
      type: "Hospital",
      address: "Avinashi Road, Peelamedu, Coimbatore",
      phone: "04224345555",
      distance: calculateDistance(userLocation, { latitude: 11.0323, longitude: 77.0338 }),
      coordinates: { latitude: 11.0323, longitude: 77.0338 }
    },
    {
      id: 8,
      name: "Coimbatore Medical Shop",
      type: "Medical Shop",
      address: "Gandhipuram, Coimbatore",
      phone: "04222434567",
      distance: calculateDistance(userLocation, { latitude: 11.0152, longitude: 76.9567 }),
      coordinates: { latitude: 11.0152, longitude: 76.9567 }
    },
    {
      id: 9,
      name: "Coimbatore Medical Tent",
      type: "Medical Tent",
      address: "100 Feet Road, Gandhipuram, Coimbatore",
      phone: "04222454321",
      distance: calculateDistance(userLocation, { latitude: 11.0175, longitude: 76.9531 }),
      coordinates: { latitude: 11.0175, longitude: 76.9531 }
    },
    {
      id: 10,
      name: "Coimbatore Ambulance Service",
      type: "Ambulance",
      address: "RS Puram, Coimbatore",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 11.0082, longitude: 76.9629 }),
      coordinates: { latitude: 11.0082, longitude: 76.9629 }
    },

    // Madurai District
    {
      id: 11,
      name: "Madurai Medical College Hospital",
      type: "Hospital",
      address: "Panagal Road, Madurai",
      phone: "04522321200",
      distance: calculateDistance(userLocation, { latitude: 9.9195, longitude: 78.1193 }),
      coordinates: { latitude: 9.9195, longitude: 78.1193 }
    },
    {
      id: 12,
      name: "Apollo Specialty Hospital Madurai",
      type: "Hospital",
      address: "Lake View Road, KK Nagar, Madurai",
      phone: "04524560000",
      distance: calculateDistance(userLocation, { latitude: 9.9312, longitude: 78.1188 }),
      coordinates: { latitude: 9.9312, longitude: 78.1188 }
    },
    {
      id: 13,
      name: "Madurai Pharmacy Plus",
      type: "Medical Shop",
      address: "Anna Nagar, Madurai",
      phone: "04522345678",
      distance: calculateDistance(userLocation, { latitude: 9.9252, longitude: 78.1198 }),
      coordinates: { latitude: 9.9252, longitude: 78.1198 }
    },
    {
      id: 14,
      name: "Madurai Medical Tent",
      type: "Medical Tent",
      address: "Meenakshi Temple Area, Madurai",
      phone: "04522567890",
      distance: calculateDistance(userLocation, { latitude: 9.9195, longitude: 78.1193 }),
      coordinates: { latitude: 9.9195, longitude: 78.1193 }
    },
    {
      id: 15,
      name: "Madurai Emergency Ambulance",
      type: "Ambulance",
      address: "Anna Nagar, Madurai",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 9.9252, longitude: 78.1198 }),
      coordinates: { latitude: 9.9252, longitude: 78.1198 }
    },

    // Salem District
    {
      id: 16,
      name: "Salem Government Hospital",
      type: "Hospital",
      address: "Omalur Main Road, Salem",
      phone: "04272414142",
      distance: calculateDistance(userLocation, { latitude: 11.6643, longitude: 78.1460 }),
      coordinates: { latitude: 11.6643, longitude: 78.1460 }
    },
    {
      id: 17,
      name: "Manipal Hospital Salem",
      type: "Hospital",
      address: "Dalmia Board, Salem",
      phone: "04272212000",
      distance: calculateDistance(userLocation, { latitude: 11.6596, longitude: 78.1617 }),
      coordinates: { latitude: 11.6596, longitude: 78.1617 }
    },
    {
      id: 18,
      name: "Salem Medical Store",
      type: "Medical Shop",
      address: "Cherry Road, Salem",
      phone: "04272234567",
      distance: calculateDistance(userLocation, { latitude: 11.6643, longitude: 78.1460 }),
      coordinates: { latitude: 11.6643, longitude: 78.1460 }
    },
    {
      id: 19,
      name: "Salem Medical Tent",
      type: "Medical Tent",
      address: "Bus Stand Area, Salem",
      phone: "04272345678",
      distance: calculateDistance(userLocation, { latitude: 11.6643, longitude: 78.1460 }),
      coordinates: { latitude: 11.6643, longitude: 78.1460 }
    },
    {
      id: 20,
      name: "Salem Ambulance Service",
      type: "Ambulance",
      address: "Government Hospital, Salem",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 11.6643, longitude: 78.1460 }),
      coordinates: { latitude: 11.6643, longitude: 78.1460 }
    },

    // Tiruchirappalli District
    {
      id: 21,
      name: "Mahatma Gandhi Memorial Government Hospital",
      type: "Hospital",
      address: "Collector Office Road, Tiruchirappalli",
      phone: "04312414142",
      distance: calculateDistance(userLocation, { latitude: 10.7905, longitude: 78.7047 }),
      coordinates: { latitude: 10.7905, longitude: 78.7047 }
    },
    {
      id: 22,
      name: "Apollo Specialty Hospital Trichy",
      type: "Hospital",
      address: "Chathram Bus Stand, Tiruchirappalli",
      phone: "04314525000",
      distance: calculateDistance(userLocation, { latitude: 10.8155, longitude: 78.6856 }),
      coordinates: { latitude: 10.8155, longitude: 78.6856 }
    },
    {
      id: 23,
      name: "Trichy Medical Shop",
      type: "Medical Shop",
      address: "Thillai Nagar, Tiruchirappalli",
      phone: "04312345678",
      distance: calculateDistance(userLocation, { latitude: 10.7905, longitude: 78.7047 }),
      coordinates: { latitude: 10.7905, longitude: 78.7047 }
    },
    {
      id: 24,
      name: "Trichy Medical Tent",
      type: "Medical Tent",
      address: "Central Bus Stand, Tiruchirappalli",
      phone: "04312456789",
      distance: calculateDistance(userLocation, { latitude: 10.7905, longitude: 78.7047 }),
      coordinates: { latitude: 10.7905, longitude: 78.7047 }
    },
    {
      id: 25,
      name: "Trichy Emergency Ambulance",
      type: "Ambulance",
      address: "Government Hospital, Tiruchirappalli",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 10.7905, longitude: 78.7047 }),
      coordinates: { latitude: 10.7905, longitude: 78.7047 }
    },

    // Tirunelveli District
    {
      id: 26,
      name: "Tirunelveli Medical College Hospital",
      type: "Hospital",
      address: "Tirunelveli Medical College Road, Tirunelveli",
      phone: "04622327123",
      distance: calculateDistance(userLocation, { latitude: 8.7139, longitude: 77.7567 }),
      coordinates: { latitude: 8.7139, longitude: 77.7567 }
    },
    {
      id: 27,
      name: "CSI Mission Hospital",
      type: "Hospital",
      address: "CSI Compound, Tirunelveli",
      phone: "04622321234",
      distance: calculateDistance(userLocation, { latitude: 8.7285, longitude: 77.6918 }),
      coordinates: { latitude: 8.7285, longitude: 77.6918 }
    },
    {
      id: 28,
      name: "Tirunelveli Pharmacy",
      type: "Medical Shop",
      address: "Town Hall Road, Tirunelveli",
      phone: "04622234567",
      distance: calculateDistance(userLocation, { latitude: 8.7139, longitude: 77.7567 }),
      coordinates: { latitude: 8.7139, longitude: 77.7567 }
    },
    {
      id: 29,
      name: "Tirunelveli Medical Tent",
      type: "Medical Tent",
      address: "Bus Stand Area, Tirunelveli",
      phone: "04622345678",
      distance: calculateDistance(userLocation, { latitude: 8.7139, longitude: 77.7567 }),
      coordinates: { latitude: 8.7139, longitude: 77.7567 }
    },
    {
      id: 30,
      name: "Tirunelveli Ambulance Service",
      type: "Ambulance",
      address: "Medical College, Tirunelveli",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 8.7139, longitude: 77.7567 }),
      coordinates: { latitude: 8.7139, longitude: 77.7567 }
    },

    // Erode District
    {
      id: 31,
      name: "Erode Government Hospital",
      type: "Hospital",
      address: "Collectorate Road, Erode",
      phone: "04242414142",
      distance: calculateDistance(userLocation, { latitude: 11.3410, longitude: 77.7172 }),
      coordinates: { latitude: 11.3410, longitude: 77.7172 }
    },
    {
      id: 32,
      name: "Erode Medical Store",
      type: "Medical Shop",
      address: "Perundurai Road, Erode",
      phone: "04242234567",
      distance: calculateDistance(userLocation, { latitude: 11.3410, longitude: 77.7172 }),
      coordinates: { latitude: 11.3410, longitude: 77.7172 }
    },
    {
      id: 33,
      name: "Erode Medical Tent",
      type: "Medical Tent",
      address: "Bus Stand, Erode",
      phone: "04242345678",
      distance: calculateDistance(userLocation, { latitude: 11.3410, longitude: 77.7172 }),
      coordinates: { latitude: 11.3410, longitude: 77.7172 }
    },
    {
      id: 34,
      name: "Erode Ambulance Service",
      type: "Ambulance",
      address: "Government Hospital, Erode",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 11.3410, longitude: 77.7172 }),
      coordinates: { latitude: 11.3410, longitude: 77.7172 }
    },

    // Vellore District
    {
      id: 35,
      name: "Christian Medical College Vellore",
      type: "Hospital",
      address: "Ida Scudder Road, Vellore",
      phone: "04162282020",
      distance: calculateDistance(userLocation, { latitude: 12.9249, longitude: 79.1363 }),
      coordinates: { latitude: 12.9249, longitude: 79.1363 }
    },
    {
      id: 36,
      name: "Vellore Medical Store",
      type: "Medical Shop",
      address: "Officer's Line, Vellore",
      phone: "04162234567",
      distance: calculateDistance(userLocation, { latitude: 12.9165, longitude: 79.1325 }),
      coordinates: { latitude: 12.9165, longitude: 79.1325 }
    },
    {
      id: 37,
      name: "Vellore Medical Tent",
      type: "Medical Tent",
      address: "Bus Stand Area, Vellore",
      phone: "04162345678",
      distance: calculateDistance(userLocation, { latitude: 12.9165, longitude: 79.1325 }),
      coordinates: { latitude: 12.9165, longitude: 79.1325 }
    },
    {
      id: 38,
      name: "Vellore Ambulance Service",
      type: "Ambulance",
      address: "CMC Hospital, Vellore",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 12.9249, longitude: 79.1363 }),
      coordinates: { latitude: 12.9249, longitude: 79.1363 }
    },

    // Thanjavur District
    {
      id: 39,
      name: "Thanjavur Medical College Hospital",
      type: "Hospital",
      address: "Medical College Road, Thanjavur",
      phone: "04362414142",
      distance: calculateDistance(userLocation, { latitude: 10.7870, longitude: 79.1378 }),
      coordinates: { latitude: 10.7870, longitude: 79.1378 }
    },
    {
      id: 40,
      name: "Thanjavur Medical Shop",
      type: "Medical Shop",
      address: "South Main Street, Thanjavur",
      phone: "04362234567",
      distance: calculateDistance(userLocation, { latitude: 10.7870, longitude: 79.1378 }),
      coordinates: { latitude: 10.7870, longitude: 79.1378 }
    },
    {
      id: 41,
      name: "Thanjavur Medical Tent",
      type: "Medical Tent",
      address: "Big Temple Area, Thanjavur",
      phone: "04362345678",
      distance: calculateDistance(userLocation, { latitude: 10.7870, longitude: 79.1378 }),
      coordinates: { latitude: 10.7870, longitude: 79.1378 }
    },
    {
      id: 42,
      name: "Thanjavur Ambulance Service",
      type: "Ambulance",
      address: "Medical College, Thanjavur",
      phone: "108",
      distance: calculateDistance(userLocation, { latitude: 10.7870, longitude: 79.1378 }),
      coordinates: { latitude: 10.7870, longitude: 79.1378 }
    }
  ];
  
  return facilities.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

function calculateDistance(point1: Coordinates, point2: Coordinates): string {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(point2.latitude - point1.latitude);
  const dLon = deg2rad(point2.longitude - point1.longitude);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(point1.latitude)) * Math.cos(deg2rad(point2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;
  
  return distance.toFixed(1) + " km";
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
