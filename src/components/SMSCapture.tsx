import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Send, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { pipeline } from '@huggingface/transformers';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

const SMSCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [isAccidentDetected, setIsAccidentDetected] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    autoAcquireLocation();
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const autoAcquireLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          });
          console.log("Location acquired automatically:", { latitude, longitude });
        },
        (error) => {
          console.log("Location error, using default Chennai coordinates:", error);
          setLocationData({
            latitude: 13.0827,
            longitude: 80.2707,
            timestamp: new Date().toISOString()
          });
        },
        { 
          enableHighAccuracy: true, 
          timeout: 5000, 
          maximumAge: 300000 
        }
      );
    } else {
      setLocationData({
        latitude: 13.0827,
        longitude: 80.2707,
        timestamp: new Date().toISOString()
      });
    }
  };

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
      console.error('Camera access error:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (imageDataUrl: string): Promise<boolean> => {
    try {
      setAnalyzing(true);
      
      // Create image classification pipeline
      const classifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50',
        { device: 'webgpu' }
      );

      // Use the image data URL directly instead of creating an image element
      const results = await classifier(imageDataUrl);
      
      console.log('Image analysis results:', results);

      // Check for accident-related keywords in classification results
      const accidentKeywords = [
        'fire', 'flame', 'smoke', 'burning', 'crash', 'accident', 'wreck', 'collision',
        'ambulance', 'police', 'emergency', 'damage', 'broken', 'debris', 'injury',
        'blood', 'hospital', 'rescue', 'disaster', 'explosion', 'flood', 'storm'
      ];

      const isAccident = results.some((result: any) => 
        accidentKeywords.some(keyword => 
          result.label.toLowerCase().includes(keyword)
        ) && result.score > 0.1
      );

      return isAccident;

    } catch (error) {
      console.error('Error analyzing image:', error);
      // If analysis fails, allow the image to proceed (benefit of doubt)
      toast.error("Image analysis failed, proceeding with caution");
      return true;
    } finally {
      setAnalyzing(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Analyze the captured image
      const isAccident = await analyzeImage(imageDataUrl);
      
      if (!isAccident) {
        toast.error("No emergency situation detected in the image. Please capture an image showing the emergency.");
        setIsAccidentDetected(false);
        return;
      }

      setCapturedImage(imageDataUrl);
      setIsAccidentDetected(true);
      autoAcquireLocation();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      toast.success("Emergency situation detected! Image accepted.");
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setIsAccidentDetected(false);
    startCamera();
  };

  const sendSMS = async () => {
    if (!capturedImage || !locationData) {
      toast.error("Missing photo or location data");
      return;
    }
    
    setLoading(true);
    
    try {
      const googleMapsLink = `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
      const emergencyNumber = "9092023126";
      
      const smsMessage = `EMERGENCY ALERT from TEJUS App! Location: ${googleMapsLink} Time: ${new Date(locationData.timestamp).toLocaleString()} - Photo captured for emergency assistance. Please respond immediately!`;
      
      const smsUrl = `sms:${emergencyNumber}?body=${encodeURIComponent(smsMessage)}`;
      
      if (window.localStorage) {
        window.localStorage.setItem(`emergency_image_${Date.now()}`, capturedImage);
      }
      
      window.location.href = smsUrl;
      
      toast.success("SMS app opened! Please send the message manually.");
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error("Error preparing SMS:", error);
      toast.error("Failed to prepare SMS. Please call emergency services directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-orange-600 p-3 text-white flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:bg-orange-700">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold ml-2 flex-1 text-center">{t('sms.title')}</h1>
        <LanguageSelector />
      </div>
      
      <div className="flex-1 bg-black relative overflow-hidden">
        {!capturedImage ? (
          <>
            {(loading || analyzing) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                <div className="text-white text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>{analyzing ? "Analyzing image for emergency..." : t('sms.preparing')}</p>
                </div>
              </div>
            )}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <Button 
                onClick={capturePhoto}
                className="h-16 w-16 rounded-full bg-orange-600 hover:bg-orange-700 border-4 border-white"
                disabled={loading || analyzing}
              >
                <Camera size={32} />
              </Button>
            </div>
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black/70 text-white text-sm p-2 rounded">
                <p className="text-center">📱 {t('sms.offline')}</p>
                <p className="text-center text-xs mt-1">🔍 AI will verify emergency situation</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <img 
              src={capturedImage} 
              alt="Captured emergency" 
              className="w-full h-full object-cover" 
            />
            {isAccidentDetected && (
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-green-900/80 text-green-200 text-sm p-2 rounded flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  <p className="text-center flex-1">Emergency situation verified ✓</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-4">
              <Button 
                onClick={resetCapture}
                className="h-14 w-14 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                disabled={loading}
              >
                <X size={24} />
              </Button>
              <Button 
                onClick={sendSMS}
                className="h-14 w-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading || !isAccidentDetected}
              >
                <Send size={24} />
              </Button>
            </div>
          </>
        )}
      </div>
      
      {locationData && (
        <div className="bg-gray-800 p-3 border-t border-gray-700">
          <div className="flex items-center text-sm text-gray-300">
            <MapPin size={16} className="mr-1 text-orange-500" />
            <p className="truncate">
              {t('sms.location')} {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            📱 {t('sms.willSend')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SMSCapture;
