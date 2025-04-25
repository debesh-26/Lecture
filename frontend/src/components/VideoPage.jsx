import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './videoPlayer';

const VideoPage = () => {
  const { videoId } = useParams();

  return (
    <div>
      <h2>Video Player</h2>
      <VideoPlayer videoId={videoId} />
    </div>
  );
};

export default VideoPage;
