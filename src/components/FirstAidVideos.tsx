import React from 'react';
import { Play, BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const FirstAidVideos = () => {
  const videos = [
    {
      id: 'first-aid',
      title: 'Basic First Aid Tutorial',
      embedId: '5OKFljZ2GQE',
      description: 'Learn essential first aid techniques for emergencies',
      icon: BookOpen,
      color: 'bg-info'
    },
    {
      id: 'cpr',
      title: 'CPR Tutorial',
      embedId: 'BQNNOh8c8ks',
      description: 'Step-by-step guide to performing CPR correctly',
      icon: Heart,
      color: 'bg-emergency'
    }
  ];

  return (
    <div className="card-elevated p-6">
      <div className="section-header">
        <div className="icon-container">
          <Play className="h-5 w-5" fill="currentColor" />
        </div>
        <div>
          <h2 className="section-title">Emergency Training</h2>
          <p className="section-subtitle">Learn life-saving techniques</p>
        </div>
      </div>
      
      <div className="space-y-5">
        {videos.map((video, index) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group card-elevated p-4 hover:border-primary/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${video.color} text-white`}>
                <video.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground">{video.description}</p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FirstAidVideos;
