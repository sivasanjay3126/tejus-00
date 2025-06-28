
-- Create emergency_incidents table to store all emergency reports
CREATE TABLE public.emergency_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  image_data TEXT, -- Base64 encoded image data
  incident_type TEXT NOT NULL DEFAULT 'emergency',
  message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance on timestamp queries
CREATE INDEX idx_emergency_incidents_timestamp ON public.emergency_incidents(timestamp);
CREATE INDEX idx_emergency_incidents_phone ON public.emergency_incidents(phone_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.emergency_incidents ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert emergency incidents (public emergency reporting)
CREATE POLICY "Allow emergency incident reporting" 
  ON public.emergency_incidents 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows reading all incidents (for emergency services)
CREATE POLICY "Allow reading emergency incidents" 
  ON public.emergency_incidents 
  FOR SELECT 
  USING (true);
