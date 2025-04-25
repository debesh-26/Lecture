const Video = require("../models/Video.js");

exports.uploadVideo = async (req, res) => {
  try {
    const { title, duration, videoFilePath } = req.body;
    if (!title || !duration || !videoFilePath) {
      return res.status(400).json({ error: "Missing fields." });
    }
    const video = new Video({
      title,
      duration,
      videoFilePath,
      uploader: req.user,
    });
    await video.save();
    res.status(200).json({ message: "Video saved.", video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video || !video.videoFilePath) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json({
      _id: video._id,
      title: video.title,
      duration: video.duration,
      videoUrl: video.videoFilePath, 
      uploadedAt: video.uploadedAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
};

exports.getUserVideos = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const videos = await Video.find({ uploader: req.user });
    res.json(videos);
  } catch (error) {
    console.error("Error fetching user videos:", error.message);
    res.status(500).json({ error: "Failed to fetch user videos" });
  }
};

const Progress = require("../models/Progress");

exports.getUserVideosWithProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const videos = await Video.find({ uploader: userId });

    const progressData = await Progress.find({ user: userId }).populate(
      "video",
      "title duration"
    );

    const progressMap = {};
    for (const progress of progressData) {
      progressMap[progress.video._id] = {
        percentage: progress.percentage,
        lastPosition: progress.lastPosition,
        intervals: progress.intervals,
      };
    }

    const videosWithProgress = videos.map((video) => ({
      _id: video._id,
      title: video.title,
      duration: video.duration,
      uploadedAt: video.uploadedAt,
      videoFilePath: video.videoFilePath,
      progress: progressMap[video._id] || {
        percentage: 0,
        lastPosition: 0,
        intervals: [],
      },
    }));

    res.json(videosWithProgress);
  } catch (error) {
    console.error("Error fetching videos with progress:", error.message);
    res.status(500).json({ error: "Failed to fetch videos with progress" });
  }
};
