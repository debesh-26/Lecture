import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "./Home.css";
import VideoList from "../components/VideoList";
import VideoUpload from "../components/VideoUpload";

const Home = () => {
  const [isauthenticated, setisAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setisAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Header
        setisAuthenticated={setisAuthenticated}
        isauthenticated={isauthenticated}
      />
      {isauthenticated ? (
        <>
          <VideoUpload />
          <VideoList />
        </>
      ) : (
        <div className="bodyy">
          <h3>Sign Up for Free and see your Video Progress</h3>
        </div>
      )}
    </>
  );
};

export default Home;
