

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");

  const isPlaying = useRef(false);
  const intervals = useRef([]);
  const currentInterval = useRef({ start: 0, end: 0 });

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        const videoRes = await axios.get(
          `http://localhost:8000/api/videos/${videoId}`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        setVideoUrl(videoRes.data.videoUrl);
        setVideoDuration(videoRes.data.duration);

        const progressRes = await axios.get(
          `http://localhost:8000/api/progress/${videoId}`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );

        intervals.current = progressRes.data.intervals;
        setProgress(progressRes.data.percentage);
        setLastPosition(progressRes.data.lastPosition);

        if (videoRef.current) {
          videoRef.current.currentTime = progressRes.data.lastPosition;
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializePlayer();
  }, [videoId]);

  const saveProgressToServer = async (newIntervals, currentTime) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/progress/${videoId}`,
        {
          intervals: newIntervals,
          currentTime,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );

      setProgress(res.data.percentage);
      setLastPosition(res.data.lastPosition);
      intervals.current = res.data.intervals;
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handlePlay = () => {
    isPlaying.current = true;
    currentInterval.current = {
      start: videoRef.current.currentTime,
      end: videoRef.current.currentTime,
    };
  };

  const handlePause = () => {
    isPlaying.current = false;
    if (currentInterval.current.end > currentInterval.current.start) {
      const newIntervals = [...intervals.current, currentInterval.current];
      saveProgressToServer(newIntervals, videoRef.current.currentTime);
    }
  };

  const handleSeek = () => {
    if (isPlaying.current) {
      const now = videoRef.current.currentTime;
      if (now > currentInterval.current.start) {
        const updatedIntervals = [
          ...intervals.current,
          {
            start: currentInterval.current.start,
            end: now,
          },
        ];
        saveProgressToServer(updatedIntervals, now);
      }
      currentInterval.current = { start: now, end: now };
    }
  };

  const handleTimeUpdate = () => {
    if (isPlaying.current) {
      currentInterval.current.end = videoRef.current.currentTime;
    }
  };

  const handleEnded = () => {
    saveProgressToServer([{ start: 0, end: videoDuration }], videoDuration);
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => setVideoDuration(videoRef.current.duration)}
        width="640"
        height="360"
      />

      <div className="progress-info">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Watched: {progress.toFixed(1)}% • Last Position:{" "}
          {lastPosition.toFixed(1)}s • Duration: {videoDuration.toFixed(1)}s
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
