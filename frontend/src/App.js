import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';


import './App.css';
import Authentication from './pages/Authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import HomePage from './pages/HomePage';

function App() {
  return (
    <>
      <Router>

        <AuthProvider>

          <Routes>

            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/:url" element={<VideoMeetComponent />} />
          </Routes>

        </AuthProvider>

      </Router>
    </>
  );
}

export default App;
