const Progress = require('../models/Progress');
const Video = require('../models/Video');

const mergeIntervals = (intervals) => {
  if (intervals.length === 0) return [];
  
  intervals.sort((a, b) => a.start - b.start);
  
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const current = intervals[i];
      
      if (current.start <= last.end) {
          last.end = Math.max(last.end, current.end);
      } else {
          merged.push(current);
      }
  }
  return merged;
};

exports.updateProgress = async (req, res) => {
  try {
    const { intervals, currentTime } = req.body;
    const video = await Video.findById(req.params.videoId);
    
    if (!video) return res.status(404).json({ error: 'Video not found' });

    let progress = await Progress.findOne({
      user: req.user.id,
      video: req.params.videoId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user,
        video: req.params.videoId,
        intervals: [],
        lastPosition: 0,
        videoDuration: video.duration
      });
    }

    const allIntervals = [...progress.intervals, ...intervals];
    const mergedIntervals = mergeIntervals(allIntervals);
    
    const totalWatched = mergedIntervals.reduce((sum, interval) => 
      sum + (interval.end - interval.start), 0);

    progress.intervals = mergedIntervals;
    progress.lastPosition = currentTime;
    progress.videoDuration = video.duration;
    progress.percentage = Math.min((totalWatched / video.duration) * 100, 100);

    if (progress.percentage >= 99.9) {
      progress.percentage = 100;
      progress.intervals = [{ start: 0, end: video.duration }];
    }

    await progress.save();
    
    res.json({
      success: true,
      percentage: progress.percentage,
      lastPosition: progress.lastPosition,
      intervals: progress.intervals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user,
      video: req.params.videoId
    }).populate('video');

    if (!progress) {
      return res.json({
        percentage: 0,
        lastPosition: 0,
        intervals: [],
        videoDuration: 0
      });
    }

    res.json({
      percentage: progress.percentage,
      lastPosition: progress.lastPosition,
      intervals: progress.intervals,
      videoDuration: progress.videoDuration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
  };