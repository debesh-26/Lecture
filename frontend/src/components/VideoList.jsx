import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://lecture-qvg9.onrender.com/api/videos', {
          headers: {
            'x-auth-token': token
          },
        });
        console.log(res.data,18)
        setVideos(res.data);
      } catch (err) {
        setError('Failed to fetch videos');
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h2>Your Videos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {videos.map((video) => (
          <li key={video._id} style={{ marginBottom: '10px' }}>
            <Link to={`/videos/${video._id}`}>
            {video.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
