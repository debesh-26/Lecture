import React, { useEffect, useState } from "react";
import Register from "./pages/Register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VideoPage from "./components/VideoPage"; 
const App = () => {
  const [isauthenticated, setisAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisAuthenticated(true);
    }
  }, []);

  if (isauthenticated) {
    console.log("Everything Is Fine");
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setisAuthenticated={setisAuthenticated} />}
        />
        <Route path="/videos/:videoId" element={<VideoPage />} />
      </Routes>
    </Router>
  );
};

export default App;
