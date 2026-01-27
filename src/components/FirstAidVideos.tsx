
import React from 'react';
import { Play, BookOpen, Heart } from 'lucide-react';

const FirstAidVideos = () => {
  const videos = [
    {
      id: 'first-aid',
      title: 'Basic First Aid Tutorial',
      embedId: '5OKFljZ2GQE',
      description: 'Learn essential first aid techniques for emergencies',
      icon: BookOpen,
      color: 'from-neon-cyan to-neon-green'
    },
    {
      id: 'cpr',
      title: 'CPR Tutorial',
      embedId: 'BQNNOh8c8ks',
      description: 'Step-by-step guide to performing CPR correctly',
      icon: Heart,
      color: 'from-neon-pink to-neon-purple'
    }
  ];

  return (
    <div className="neon-card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="icon-container-cyber">
          <Play className="h-5 w-5 text-white" fill="currentColor" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Emergency Training</h2>
          <p className="text-sm text-muted-foreground">Learn life-saving techniques</p>
        </div>
      </div>
      
      <div className="space-y-5">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="group neon-card-hover p-4 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${video.color}`}>
                <video.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground group-hover:text-neon-cyan transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground">{video.description}</p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstAidVideos;
