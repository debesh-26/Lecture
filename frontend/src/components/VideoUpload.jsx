import React, { useState} from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [videoPerc, setVideoPerc] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState();

  const handleUpload = () => {
    if (!video) return alert("Please select a video!");

    const storage = getStorage(app);
    const fileName = `${Date.now()}_${video.name}`;
    const storageRef = ref(storage, `videos/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, video);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setVideoPerc(Math.round(progress));
      },
      (error) => {
        console.error("Upload failed:", error);
        alert("Upload failed.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          setVideoUrl(url);
          try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
              "https://lecture-qvg9.onrender.com/api/videos/upload",
              {
                title,
                duration,
                videoFilePath: url,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "x-auth-token": token,
                },
              }
            );
            console.log("Saved in DB:", res.data);
          } catch (err) {
            console.error(err);
          }
        });
      }
    );
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Upload Video to Firebase</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Enter video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
      />
      <input
        type="number"
        placeholder="Enter duration in seconds"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <button onClick={handleUpload} style={{ padding: "0.5rem 1rem" }}>
        Upload
      </button>
      {videoPerc > 0 && videoPerc < 100 && <p>Uploading: {videoPerc}%</p>}
      {videoUrl && (
        <div style={{ marginTop: "2rem" }}>
          <h4>Uploaded Video Preview:</h4>
          <video width="100%" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
