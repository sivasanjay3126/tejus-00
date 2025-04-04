
import React from 'react';
import { Video } from 'lucide-react';

const FirstAidVideos = () => {
  const videos = [
    {
      id: 'first-aid',
      title: 'Basic First Aid Tutorial',
      embedId: '5OKFljZ2GQE',
      description: 'Learn essential first aid techniques for emergencies'
    },
    {
      id: 'cpr',
      title: 'CPR Tutorial',
      embedId: 'BQNNOh8c8ks',
      description: 'Step-by-step guide to performing CPR correctly'
    }
  ];

  return (
    <div className="info-section">
      <h2 className="section-title">
        <Video />
        Emergency Medical Training
      </h2>
      
      <div className="space-y-6">
        {videos.map(video => (
          <div key={video.id} className="video-container">
            <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{video.description}</p>
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.embedId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstAidVideos;
