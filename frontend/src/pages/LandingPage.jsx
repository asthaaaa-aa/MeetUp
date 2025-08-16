import React from "react";
import "../styles/landingPage.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../utils/Navbar.jsx"

export default function LandingPage() {
  const router = useNavigate();
  return (
    <div className="wrapper">
        <Navbar/>
        <div className="hero-section">
        <div className="hero-text">
          <div className="hero-heading">
            <h1>
              Seamless Video. <br /> Limitless Collaboration.
            </h1> <br />
            <p>Crystal Clear Video. Effortless Collaboration.</p>
          </div>
          <button
            onClick={() => {
              router("/guest-meet");
            }}
          >
            Join as guest
          </button>
        </div>
        <div className="hero-img">
          <img src="hero-img.png" alt="" />
        </div>
      </div>
    </div>
  );
}
