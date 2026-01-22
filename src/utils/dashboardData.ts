// Dashboard data utilities for accident monitoring
// Data resets daily and increases throughout the day

const REGIONS = ['Salem', 'Erode', 'Namakkal', 'Dharmapuri', 'Coimbatore'] as const;
export type Region = typeof REGIONS[number];

// Get current hour multiplier (data increases throughout the day)
const getHourMultiplier = () => {
  const hour = new Date().getHours();
  return Math.max(1, hour / 24);
};

// Get minute-based variation for real-time feel
const getMinuteVariation = () => {
  const minutes = new Date().getMinutes();
  return 1 + (minutes / 60) * 0.1;
};

// Base accident rates per region (accidents per day on average)
const REGION_BASE_RATES: Record<Region, number> = {
  'Salem': 12,
  'Erode': 8,
  'Namakkal': 6,
  'Dharmapuri': 5,
  'Coimbatore': 15
};

// Dangerous roads per region
export const DANGEROUS_ROADS: Record<Region, { name: string; accidents: number; severity: string }[]> = {
  'Salem': [
    { name: 'Salem-Chennai Highway (NH48)', accidents: 45, severity: 'High' },
    { name: 'Yercaud Ghat Road', accidents: 32, severity: 'Critical' },
    { name: 'Salem-Bangalore Road', accidents: 28, severity: 'High' },
    { name: 'Omalur Main Road', accidents: 18, severity: 'Medium' }
  ],
  'Erode': [
    { name: 'Erode-Coimbatore Highway', accidents: 38, severity: 'High' },
    { name: 'Perundurai Road', accidents: 22, severity: 'Medium' },
    { name: 'Bhavani Bridge Area', accidents: 19, severity: 'High' },
    { name: 'Gobichettipalayam Road', accidents: 15, severity: 'Medium' }
  ],
  'Namakkal': [
    { name: 'Namakkal-Trichy Highway', accidents: 28, severity: 'High' },
    { name: 'Kolli Hills Ghat Road', accidents: 35, severity: 'Critical' },
    { name: 'Rasipuram Main Road', accidents: 16, severity: 'Medium' },
    { name: 'Tiruchengode Bypass', accidents: 12, severity: 'Medium' }
  ],
  'Dharmapuri': [
    { name: 'Dharmapuri-Krishnagiri Highway', accidents: 30, severity: 'High' },
    { name: 'Hogenakkal Road', accidents: 25, severity: 'Critical' },
    { name: 'Palacode Main Road', accidents: 14, severity: 'Medium' },
    { name: 'Pennagaram Road', accidents: 11, severity: 'Medium' }
  ],
  'Coimbatore': [
    { name: 'Avinashi Road', accidents: 52, severity: 'Critical' },
    { name: 'Sathy Road', accidents: 38, severity: 'High' },
    { name: 'Mettupalayam Road', accidents: 34, severity: 'High' },
    { name: 'Pollachi Road', accidents: 28, severity: 'Medium' }
  ]
};

// Hotspot coordinates (approximate)
export const HOTSPOT_COORDINATES: Record<Region, { lat: number; lng: number; intensity: number }[]> = {
  'Salem': [
    { lat: 11.6643, lng: 78.1460, intensity: 0.9 },
    { lat: 11.7781, lng: 78.1303, intensity: 0.7 },
    { lat: 11.5500, lng: 78.2100, intensity: 0.6 }
  ],
  'Erode': [
    { lat: 11.3410, lng: 77.7172, intensity: 0.8 },
    { lat: 11.4200, lng: 77.6800, intensity: 0.6 },
    { lat: 11.2800, lng: 77.7500, intensity: 0.5 }
  ],
  'Namakkal': [
    { lat: 11.2189, lng: 78.1674, intensity: 0.7 },
    { lat: 11.3500, lng: 78.2000, intensity: 0.8 },
    { lat: 11.1800, lng: 78.1200, intensity: 0.5 }
  ],
  'Dharmapuri': [
    { lat: 12.1211, lng: 78.1582, intensity: 0.7 },
    { lat: 12.0500, lng: 78.2000, intensity: 0.6 },
    { lat: 12.2000, lng: 78.1000, intensity: 0.5 }
  ],
  'Coimbatore': [
    { lat: 11.0168, lng: 76.9558, intensity: 0.95 },
    { lat: 11.0800, lng: 77.0200, intensity: 0.8 },
    { lat: 10.9500, lng: 76.9000, intensity: 0.7 }
  ]
};

export interface LiveStats {
  totalAccidentsToday: number;
  totalAccidentsMonth: number;
  alertsSent: number;
  avgResponseTime: number;
  byRegion: Record<Region, number>;
}

export interface TimeAnalysis {
  byHour: { hour: string; accidents: number }[];
  byDay: { day: string; accidents: number }[];
}

export interface SeverityData {
  minor: number;
  major: number;
  critical: number;
  criticalRescuedIn10Min: number;
}

export interface SystemPerformance {
  detectionSuccessRate: number;
  falseAlertRate: number;
  avgNotificationTime: number;
}

// Generate live stats
export const getLiveStats = (): LiveStats => {
  const multiplier = getHourMultiplier() * getMinuteVariation();
  
  const byRegion: Record<Region, number> = {} as Record<Region, number>;
  let totalToday = 0;
  
  REGIONS.forEach(region => {
    const accidents = Math.floor(REGION_BASE_RATES[region] * multiplier);
    byRegion[region] = accidents;
    totalToday += accidents;
  });
  
  return {
    totalAccidentsToday: totalToday,
    totalAccidentsMonth: totalToday + Math.floor(Math.random() * 50) + 280, // Monthly cumulative
    alertsSent: Math.floor(totalToday * 1.2), // Slightly more alerts than accidents
    avgResponseTime: 8.5 + Math.random() * 3, // 8.5-11.5 minutes
    byRegion
  };
};

// Generate time analysis data
export const getTimeAnalysis = (): TimeAnalysis => {
  const currentHour = new Date().getHours();
  
  // Hourly distribution - more accidents during peak hours
  const hourlyPattern = [
    0.3, 0.2, 0.15, 0.1, 0.15, 0.4, 0.7, 1.2, 1.5, 1.3, 1.0, 0.9,
    1.1, 1.0, 0.9, 1.0, 1.3, 1.8, 2.0, 1.5, 1.2, 0.9, 0.6, 0.4
  ];
  
  const byHour = hourlyPattern.map((factor, i) => {
    const accidents = i <= currentHour ? Math.floor(factor * 5 + Math.random() * 3) : 0;
    return {
      hour: `${i.toString().padStart(2, '0')}:00`,
      accidents
    };
  });
  
  // Day of week distribution
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayFactors = [1.4, 0.9, 0.85, 0.9, 0.95, 1.3, 1.5];
  const today = new Date().getDay();
  
  const byDay = days.map((day, i) => ({
    day: day.slice(0, 3),
    accidents: i <= today ? Math.floor(dayFactors[i] * 25 + Math.random() * 10) : 0
  }));
  
  return { byHour, byDay };
};

// Generate severity data
export const getSeverityData = (): SeverityData => {
  const multiplier = getHourMultiplier();
  const total = Math.floor(46 * multiplier);
  
  return {
    minor: Math.floor(total * 0.55), // 55% minor
    major: Math.floor(total * 0.30), // 30% major
    critical: Math.floor(total * 0.15), // 15% critical
    criticalRescuedIn10Min: 78 + Math.floor(Math.random() * 10) // 78-88%
  };
};

// Generate system performance data
export const getSystemPerformance = (): SystemPerformance => {
  return {
    detectionSuccessRate: 94.5 + Math.random() * 3, // 94.5-97.5%
    falseAlertRate: 2.1 + Math.random() * 1.5, // 2.1-3.6%
    avgNotificationTime: 12 + Math.random() * 8 // 12-20 seconds
  };
};

export const REGIONS_LIST = REGIONS;
