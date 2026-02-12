import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Play, Square, AlertTriangle, TrendingUp, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVehicleSpeed } from '@/hooks/useVehicleSpeed';

const SpeedMonitor = () => {
  const {
    currentSpeed,
    maxSpeed,
    isOverspeed,
    isTracking,
    accuracy,
    startTracking,
    stopTracking,
    SPEED_THRESHOLD,
  } = useVehicleSpeed();

  const speedPercent = Math.min((currentSpeed / 150) * 100, 100);
  const thresholdPercent = (SPEED_THRESHOLD / 150) * 100;

  // Arc calculations for speedometer
  const radius = 90;
  const circumference = Math.PI * radius; // half circle
  const strokeDashoffset = circumference - (speedPercent / 100) * circumference;

  return (
    <div className={`card-elevated p-6 transition-all duration-500 ${isOverspeed ? 'border-emergency/50 bg-emergency/5' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="section-header mb-0">
          <div className={isOverspeed ? 'icon-container-emergency' : 'icon-container'}>
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="section-title">Speed Monitor</h3>
            <p className="section-subtitle">Real-time GPS vehicle speed</p>
          </div>
        </div>
        <Button
          variant={isTracking ? "destructive" : "default"}
          size="sm"
          onClick={isTracking ? stopTracking : startTracking}
          className="rounded-xl gap-2"
        >
          {isTracking ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isTracking ? 'Stop' : 'Start'} Tracking
        </Button>
      </div>

      {/* Speedometer Gauge */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-56 h-32">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 100 A 90 90 0 0 1 190 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Threshold marker */}
            <path
              d="M 10 100 A 90 90 0 0 1 190 100"
              fill="none"
              stroke="hsl(var(--warning) / 0.3)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={circumference - (thresholdPercent / 100) * circumference}
              className="opacity-40"
            />
            {/* Speed arc */}
            <motion.path
              d="M 10 100 A 90 90 0 0 1 190 100"
              fill="none"
              stroke={isOverspeed ? 'hsl(var(--emergency))' : 'hsl(var(--primary))'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
          {/* Speed value */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <motion.span
              key={Math.round(currentSpeed)}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-black tabular-nums ${isOverspeed ? 'text-emergency' : 'text-foreground'}`}
            >
              {currentSpeed.toFixed(0)}
            </motion.span>
            <span className="text-xs text-muted-foreground font-medium">km/h</span>
          </div>
        </div>

        {/* Threshold line label */}
        <p className="text-xs text-muted-foreground mt-2">
          Limit: <span className="font-bold text-warning">{SPEED_THRESHOLD} km/h</span>
        </p>
      </div>

      {/* Overspeed Alert */}
      <AnimatePresence>
        {isOverspeed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-4 p-4 rounded-xl border border-emergency/30 bg-emergency/10 flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <AlertTriangle className="h-5 w-5 text-emergency" />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-emergency">⚠ Overspeed Detected!</p>
              <p className="text-xs text-muted-foreground">
                Current speed: {currentSpeed.toFixed(1)} km/h exceeds {SPEED_THRESHOLD} km/h limit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-muted/50 text-center">
          <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-black text-foreground">{maxSpeed.toFixed(0)}</p>
          <p className="text-[10px] text-muted-foreground">Max km/h</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/50 text-center">
          <Gauge className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-black text-foreground">{SPEED_THRESHOLD}</p>
          <p className="text-[10px] text-muted-foreground">Threshold</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/50 text-center">
          <Locate className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-black text-foreground">{accuracy ? `±${accuracy.toFixed(0)}m` : '—'}</p>
          <p className="text-[10px] text-muted-foreground">GPS Accuracy</p>
        </div>
      </div>

      {/* Status indicator */}
      {!isTracking && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Press <span className="font-semibold text-primary">Start Tracking</span> to begin GPS speed monitoring
        </p>
      )}
    </div>
  );
};

export default SpeedMonitor;
