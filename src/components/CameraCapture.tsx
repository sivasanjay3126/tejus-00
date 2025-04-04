import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { getCurrentLocation, sendEmergencyMessage, LocationDetails } from '@/utils/locationUtils';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const CameraCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setLocationDetails(location);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };
    
    getLocation();
    
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setLoading(true);
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Unable to access camera. Please allow camera permissions and try again.");
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  const sendAlert = async () => {
    if (!capturedImage || !locationDetails) {
      toast.error("Missing photo or location information");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(capturedImage);
      const imageBlob = await response.blob();
      
      await sendEmergencyMessage(imageBlob, locationDetails);
      
      toast.success("Emergency alert sent successfully!");
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error("Error sending alert:", error);
      toast.error("Failed to send alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-emergency p-3 text-white flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold ml-2 flex-1 text-center">TEJUS - Emergency Photo</h1>
      </div>
      
      <div className="flex-1 bg-black relative overflow-hidden">
        {!capturedImage ? (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                <div className="text-white text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Accessing camera...</p>
                </div>
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <Button 
                onClick={capturePhoto}
                className="h-16 w-16 rounded-full bg-emergency hover:bg-emergency_dark border-4 border-white"
                disabled={loading}
              >
                <Camera size={32} />
              </Button>
            </div>
          </>
        ) : (
          <>
            <img 
              src={capturedImage} 
              alt="Captured emergency" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-4">
              <Button 
                onClick={resetCapture}
                className="h-14 w-14 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                disabled={loading}
              >
                <X size={24} />
              </Button>
              <Button 
                onClick={sendAlert}
                className="h-14 w-14 rounded-full bg-emergency hover:bg-emergency_dark text-white"
                disabled={loading}
              >
                <Upload size={24} />
              </Button>
            </div>
          </>
        )}
      </div>
      
      {locationDetails && (
        <div className="bg-white p-3 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-1" />
            <p className="truncate">Location: {locationDetails.formattedAddress || 'Detecting...'}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Alert will be sent to: +91 9092023126
          </p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
